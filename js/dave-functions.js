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

        nameParserHolder.loadFiles(instance, fileList);
       
     } else {
      // maybe throw up a place to drag files to be parsed if there's nothing in the data element
     }
     // create named element per instance containing data object
     nameParserHolder.instanceData[instance]={
     files:fileList
     };//store instance data in name parser Object, do not hang off DOM element
    },
    /**
     * Load list of files and invoke parsing. Chaining from default ajax success method
     * is the only reliable way to avoid race conditions.
     *
     * @author {Dave Gipp}
     * @param {instance} The DOM ID which is invoking the function.
     * @param {fileList Object} list of files to load
     */
    loadFiles: function (instance, fileList){

        var files=fileList.split(",");
        jQuery.get(files[0],
        function(data){
          nameParserHolder.parseFiles(instance, data, files[0]);
        });
     },
     /**
     * Parse files into standard format. Preserve all data.
     *
     * @author {Dave Gipp}
     * @param {instance} The DOM ID which is invoking the function.
     * @param {fileList Object} list of files to load
     */
    parseFiles: function (instance, data, filename){
        // find instance in array and merge data into object
        jQuery.extend(nameParserHolder.instanceData[instance],{
            //store raw data
            rawdata: data
            //parsed data to go here also
        });
        // get records
        tmpData = data.split('\n');

        // file is not well spearated, clean spaces
        tmpData.forEach(function (element, index, array) {
            tmpData[index] = element.replace(/\s+/g,' ').trim();
        });
        // get individual values
        tmpData.forEach(function (element, index, array) {
            tmp = element.split(' ');
            tmpData[index] = tmp;
        });
        // store clean data under object named according to file name that was parsed
        dataTargetLocation = nameParserHolder.instanceData[instance];
        // each file has data stored under file name
        dataInjectedPerFilename = {};
        dataInjectedPerFilename[filename] = tmpData;

        jQuery.extend(dataTargetLocation,dataInjectedPerFilename);

    console.log(nameParserHolder.instanceData[instance]);

    }

};

jQuery(document).ready(function(){
  // instantiate every parser instance on page
  jQuery(".nameParser").each(function(){
    //nameParserHolder.init_state(this.id);
  });
});