let requestURL = "data/proposalGuidance.json";
let request = new XMLHttpRequest();
//getting content Element to append grants information
let maincontentContainer = document.getElementsByClassName('main-content')[0];
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function(){
    let headers_sort = ['Find information: News, Funding Opportunities, and Past Awards',
                        'Plan Your Proposal: Guidance and Resources',
                    'Draft Your Proposal: Section Instructions and Templates'];
    let content = '';
    const proposalGuidances = request.response;
    let accordionCounter = 1;
    //condition for checking if browser is Internet Explorer
    let proposalGuidance =  ((false || !!document.documentMode))? JSON.parse(proposalGuidances): proposalGuidances;
    let distinctAgencies = getDistinctAttributes(proposalGuidance, 'agency');
    createDropDownOptions(distinctAgencies);
    
    for(let i = 0; i< distinctAgencies.length; i++)
    {
        let agencyCounter = "option" + (i+1);
        let agencyGuidance = proposalGuidance.filter(function(guidance){
            return guidance.agency == distinctAgencies[i];
        });
        
        let distinctHeaders = getDistinctAttributes(agencyGuidance, 'mainheader');
        let accordionElemContent = '';
        distinctHeaders = customSort(headers_sort, distinctHeaders);
        distinctHeaders.forEach(function(header) {
           
           let mainGuidances = agencyGuidance.filter(function(guidance){
               return guidance.mainheader == header;
           });
           let subHeaders = getDistinctAttributes(mainGuidances, 'subheader');
           let linkcontent = '';
           if(subHeaders.length == 1 && subHeaders[0] == '')
           {
                linkcontent = buildLinkContent(mainGuidances);
           }
           else
           {
            subHeaders.forEach(function(subheader) {
                let subGuidances = mainGuidances.filter(function(guidance){
                    return guidance.subheader == subheader;
                });
                linkcontent += '<h4 class = "content-header-no-margin">'+ subheader + '</h4>'+
                                buildLinkContent(subGuidances);
            });
           }
           let headerId = "collapse" + accordionCounter;
           let headingId = "heading" + accordionCounter;
           accordionElemContent+= generateAccordionElem(headerId, headingId, header, linkcontent);
           accordionCounter++;
        });
        content = content + wrapAccordionContent(accordionElemContent, agencyCounter);
    }
    document.getElementById('drop-down-containers').innerHTML = content.trim();
}

let wrapAccordionContent = function(accordionElemContent, agencyCounter)
{
    let content = '<div class = "link-container" id = "'+ agencyCounter +'">'+
    '<div class = "accordion" id = "accordionExample">'+ accordionElemContent + '</div></div>';
    return content;
}

let createDropDownOptions = function(distinctAgencies)
{
    let dropdownOption = '';
    for(let i = 0; i< distinctAgencies.length; i++)
    {
        let dataAttribute = "option"+ (i+1);
        dropdownOption = dropdownOption + '<option data-selected = "' + dataAttribute + 
        '">' +  distinctAgencies[i] +'</option>';
    }
    document.getElementById('dropdown').innerHTML = dropdownOption.trim();
}

let buildLinkContent = function(guidance){
    let content = '<ul class = "sub-list">';
    for(let i = 0; i< guidance.length; i++)
    {
        content = content + '<li><a href = "'+ guidance[i].link +'">'+ guidance[i].title+'</a>';
        let staticTextContent = (guidance[i].staticText == '')? '</li>': ' - ' + guidance[i].staticText + '</li>';
        content = content + staticTextContent;
    }
    content = content + '</ul>';
    return content;
}