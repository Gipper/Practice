nameParserHolder = {
  //global instance vars

  instanceData: [],

/**
 * Access init state function.
 *
 * @author {Dave Gipp}
 * @constructor
 * @param {instance} The DOM element which is invoking the function.
 */
  init_state: function (instance){
    // do things to setup our particular instance. i.e. perhaps we have two parsers on the same page with different input file lists.
    // also likely store parsed data here and not within the DOM for easy retrieval and to keep our separation of DOM and state (data).
    
    var fileList = jQuery("#" + instance).data('filelist');
    //NOTE: data attributes can only be retrieved as lowercase in recent jQuery.
    if (fileList){
        console.log("On instance name:" + instance + ", I found these files to load:" + fileList);
        //nameParserHolder.loadFilesWithPromise(instance, fileList);
       
     } else {
      // maybe throw up a place to drag files to be parsed if there's nothing in the data element
     }
     // create named element per instance containing a palce to store our raw and clean data.
     nameParserHolder.instanceData[instance]={
     files:fileList
     };
    },
    /**
     * Load list of files and invoke parsing. Chaining from default ajax success method
     * is the only reliable way to avoid race conditions.
     *
     * @author {Dave Gipp}
     * @param {instance} The DOM ID which is invoking the function.
     */
    loadFilesWithPromise: function (instance){

        
        var files=nameParserHolder.instanceData[instance].files.split(",");
        var promiseAllFilesAreLoaded = jQuery.Deferred();
        // create area to store raw data, to be used once per retreived file.
        var dataRetrievedPerFilename = {
            rawdata:{}
            };

        var promiseRequests = jQuery.map(files, function(currentRequest){
            console.log("dispatching get for file:" + currentRequest);
            return jQuery.get(currentRequest,function (data){
                //store raw data under current filename
                dataRetrievedPerFilename.rawdata[currentRequest] = data;
                jQuery.extend(nameParserHolder.instanceData[instance], dataRetrievedPerFilename);
            });
        });

        jQuery.when.apply(jQuery,promiseRequests).then(function (data){
            console.log('All promises fulfilled for instance: ' + instance + ". Raw data is ready to parse");
            nameParserHolder.parseData(instance);
        });

     },
     /**
     * Parse collected data into standard format. Preserve all data.
     *
     * @author {Dave Gipp}
     */
    parseData: function (instance){
        var myCollections = nameParserHolder.instanceData[instance];
        var dataRetrievedPerFilename = {
            cleandata:{}
            };

        jQuery.each(myCollections.rawdata, function(filename, rawdata) {
            // get individual records
            tmpData = rawdata.split('\n');

            // file is not well spearated, clean spaces
            tmpData.forEach(function (element, index, array) {
                tmpData[index] = element.replace(/\s+/g,' ').trim();
            });
            // get individual values
            tmpData.forEach(function (element, index, array) {
                tmp = element.split(' ');
                tmpData[index] = tmp;
            });
            dataRetrievedPerFilename.cleandata[filename] = tmpData;
            jQuery.extend(nameParserHolder.instanceData[instance], dataRetrievedPerFilename);
        });

     console.log("Data parsing completed for instance:" + instance);

    }
};

jQuery(document).ready(function(){
  // instantiate every parser instance on page
  jQuery(".nameParser").each(function(){
    nameParserHolder.init_state(this.id);
  });
});