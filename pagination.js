var _ = require('lodash');



/* QUERY BUILD */
function queryBuilder(page, obj) {
	obj.page = page;
	var link = '?';
	link += _.map(obj,function(v,k){
		return encodeURIComponent(k) + '=' + encodeURIComponent(v);
	}).join('&');

	return link;
};

/*
 * Returns pagination result
 *
 * @param {number} totalCount    - Number of items that will be paginated
 * @param {number} perPage       - Number of items per page
 * @param {number} specifiedPage - Page number you wanted to get, it is started by 1
 */
 module.exports = function paginate(totalCount, perPage, specifiedPage, pageQuery) {
 	if(_.isUndefined(specifiedPage)) specifiedPage = 1;
 	if(_.isArray(specifiedPage)) specifiedPage = specifiedPage[0];
 	if(_.isArray(specifiedPage)) specifiedPage = specifiedPage[0];
 	specifiedPage = Number(specifiedPage);
 	if(_.isNaN(specifiedPage)) specifiedPage = 1;

 	var totalCount = (_.isUndefined(totalCount)) ? 0 : Number(totalCount);
 	var perPage = (_.isUndefined(perPage)) ? 10 : Number(perPage);
 	var pageQuery = (_.isUndefined(pageQuery)) ? {} : pageQuery;

 	var pageCount = _.ceil(totalCount / perPage);
 	var firstPage = (pageCount > 0) ? 1 : null;
 	var lastPage = (pageCount > 0) ? pageCount : null;

 	var currentPage = null,
 	isFirstPage = null,
 	isLastPage = null,
 	previousPage = null,
 	nextPage = null,
 	fromCount = null,
 	toCount = null;

 	if (pageCount > 0) {
 		currentPage = Math.max(Math.min(specifiedPage, lastPage), firstPage);
 		isFirstPage = currentPage === firstPage;
 		isLastPage = currentPage === lastPage;
 		previousPage = (currentPage > firstPage) ? currentPage - 1 : null;
 		nextPage = (currentPage < lastPage) ? currentPage + 1 : null;
 		fromCount = perPage * (currentPage - 1) + 1;
 		toCount = Math.min(perPage * currentPage, totalCount);
 	}


 	/* BUILD NUMBER LIST */
 	const numberToDisplay = 10;
 	var pageRange = [];
 	var tempRange = _.range(1, (pageCount+1));
 	var tempChunk = _.chunk(tempRange, numberToDisplay);
 	_.forEach(tempChunk, function(value, key) {
 		if(_.indexOf(value, currentPage) > -1){
 			pageRange = value; 
 		}
 	});
 	

 	/* BUILD NUMBER LIST && ADD LINK */
 	var pageList = [];
 	_.forEach(pageRange, function(value, key) {

 		var itemLink = queryBuilder(value,pageQuery);

 		pageList.push({
 			itemNumber: value,
 			itemLink: itemLink
 		})
 	});

 	firstPageLink = queryBuilder(firstPage, pageQuery);
 	lastPageLink = queryBuilder(lastPage, pageQuery);
 	nextPageLink = queryBuilder(nextPage, pageQuery);
 	previousPageLink = queryBuilder(previousPage, pageQuery);




 	/* create dummy content */
 	var pageContent = _.range(fromCount, toCount + 1);

 	return {
 		totalCount: totalCount,
 		perPage: perPage,
 		specifiedPage: specifiedPage,
 		totalPage: pageCount,
 		firstPage: firstPage,
 		firstPageLink: firstPageLink,
 		lastPage: lastPage,
 		lastPageLink: lastPageLink,
 		currentPage: currentPage,
 		isFirstPage: isFirstPage,
 		isLastPage: isLastPage,
 		previousPage: previousPage,
 		previousPageLink: previousPageLink,
 		nextPage: nextPage,
 		nextPageLink: nextPageLink,
 		fromCount: fromCount,
 		toCount: toCount,
 		pageList: pageList,
 		pageContent: pageContent,
 	};
 };
