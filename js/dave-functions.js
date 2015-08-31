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
        jQuery("#"+instance).append("On instance name:" + instance + ", I found these files to load:" + fileList + "<br>");
    
       
     } else {
      // maybe throw up a place to drag files to be parsed if there's nothing in the data element
     }
     // create named element per instance containing a place to store our raw and clean data.
     nameParserHolder.instanceData[instance]={
     files:fileList
     };
    nameParserHolder.loadFilesWithPromise(instance);
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
            jQuery("#"+instance).append("dispatching get for file:" + currentRequest + "<br>");
            return jQuery.get(currentRequest,function (data){
                //store raw data under current filename
                dataRetrievedPerFilename.rawdata[currentRequest] = data;
                jQuery.extend(nameParserHolder.instanceData[instance], dataRetrievedPerFilename);
            });
        });

        jQuery.when.apply(jQuery,promiseRequests).then(function (data){
            jQuery("#"+instance).append('All promises fulfilled for instance: ' + instance + ". Raw data is ready to parse" + "<br>");
            nameParserHolder.parseData(instance);
        });

     },
     /**
     * Parse collected data into standard format. Preserve all data.
     *
     * @author {Dave Gipp}
     * @param {instance} The DOM ID which is invoking the function.
     */
    parseData: function (instance){
        var myCollections = nameParserHolder.instanceData[instance];
        var dataRetrievedPerFilename = {
            cleandata:{}
            };

        jQuery.each(myCollections.rawdata, function(filename, rawdata) {
            // get individual records
            var tmpData = rawdata.split('\n');

            // file is not well spearated, clean spaces
            tmpData.forEach(function (element, index, array) {
                tmpData[index] = element.replace(/\s+/g,' ').trim();
            });
            // get individual values
            tmpData.forEach(function (element, index, array) {
                var tmp = element.split(' ');
                tmpData[index] = tmp;
            });
            dataRetrievedPerFilename.cleandata[filename] = tmpData;
            jQuery.extend(nameParserHolder.instanceData[instance], dataRetrievedPerFilename);
        });

     jQuery("#"+instance).append("Data parsing completed for instance:" + instance + "<br>");
     nameParserHolder.collateData(instance);
    },
    collateData: function (instance){
        var letterObject = {
            letters:{}
        };
        var myCollections = nameParserHolder.instanceData[instance];
        jQuery.each(myCollections.cleandata, function(filename, cleandata) {

            cleandata.forEach(function (element, index, array) {
                var name = cleandata[index][0];

                name.split("").forEach(function (element, index, array) {

                    if (!letterObject.letters[element]) {
                        letterObject.letters[element] = 1;

                    } else {
                        letterObject.letters[element] = letterObject.letters[element] + 1;
                    }
                });
            });
        });
        jQuery.extend(nameParserHolder.instanceData[instance], letterObject);
        jQuery("#"+instance).append(JSON.stringify(letterObject));
    },
    presentData: function (name) {

    }
};

jQuery(document).ready(function(){
  // instantiate every parser instance on page
  jQuery(".nameParser").each(function(){
    nameParserHolder.init_state(this.id);
  });
});