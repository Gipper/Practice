nameParserHolder = {

  instanceData: [],

    /**
     * Set up instance and prepare for loading source files to analyze
     *
     * @author {Dave Gipp}
     * @constructor
     * @param {instance} The DOM element which is invoking the function.
     */
    init_state: function (instance){

        var fileList = jQuery("#" + instance).data('filelist');
        //NOTE: data attributes can only be retrieved as lowercase in recent jQuery.
        if (fileList){
           jQuery("#"+instance).append("On instance name:" + instance + ", I found these files to load:" + fileList + "<br>");
        } else {
            //TODO: throw up a place to drag files to be parsed if there's nothing in the data element
        }

        nameParserHolder.instanceData[instance]={
            files:fileList
        };

        //nameParserHolder.loadFilesWithPromise(instance);
    },
    /**
     * Load list of files via ajax. Collect ajax results as promises
     * resolve surrounding promise and return to continue execution.
     *
     * @author {Dave Gipp}
     * @param {instance} The DOM ID which is invoking the function.
     */
    loadFilesWithPromise: function (instance){
        
        var files=nameParserHolder.instanceData[instance].files.split(",");
        var promiseAllFilesAreLoaded = new jQuery.Deferred();

        var dataRetrievedPerFilename = {
                rawdata:{}
            };

        var promiseRequests = jQuery.map(files, function(currentRequest){
            jQuery("#"+instance).append("dispatching get for file:" + currentRequest + "<br>");
            return jQuery.get(currentRequest,function (data){
                //store raw data under object named after current filename
                dataRetrievedPerFilename.rawdata[currentRequest] = data;
                jQuery.extend(nameParserHolder.instanceData[instance], dataRetrievedPerFilename);
            });
        });

        jQuery.when.apply(jQuery,promiseRequests).then(function (data){
            jQuery("#"+instance).append('All promises fulfilled for instance: ' + instance + ". Raw data is ready to parse" + "<br>");
            nameParserHolder.parseData(instance);
            promiseAllFilesAreLoaded.resolve();
        });

        return promiseAllFilesAreLoaded.promise();

     },
     /**
     * Parse collected data into standard format. Preserve all data for future use.
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
            // store clean data
            jQuery.extend(nameParserHolder.instanceData[instance], dataRetrievedPerFilename);
        });

     jQuery("#"+instance).append("Data parsing completed for instance:" + instance + "<br>");
     nameParserHolder.collateData(instance);
    },
     /**
     * Collate data by letter frequency. Add or increment into letter object.
     *
     * @author {Dave Gipp}
     * @param {instance} The DOM ID which is invoking the function.
     */
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
        jQuery("#"+instance).append(JSON.stringify(letterObject) + "<p></p>");
    },
    presentData: function (name) {

    }
};

jQuery(document).ready(function(){
    // instantiate every parser div on page, which will invoke parsing for the files listed in data element
    jQuery(".nameParser").each(function(){
        var instance = this.id;
        nameParserHolder.init_state(instance);
        nameParserHolder.loadFilesWithPromise(instance);
    });
});