describe("ParserTest", function() {
  var testHelpers = {};
  var parserTestDiv;

  testHelpers = {
    initTests: function (){
      jQuery(document).ready(function(){
        // instantiate test parser instance on page. will only be one.
        jQuery("#parserTest").each(function(){
          nameParserHolder.init_state(this.id);
        });
      });
    }
  };

  beforeEach(function() {
    // setup generic parser div
    parserTestDiv = '<div class="nameParserTest" id="parserTest"></div>';
    jQuery("#testHolder").append(parserTestDiv);
  });

 afterEach(function() {
    // tear down test DIV
    jQuery("#parserTest").remove();
  });

  describe("when loading data elements it should process two correctly", function() {

      beforeEach(function(done) {
        // add data specific to this test
        jQuery("#parserTest").data('filelist',"male-first.txt,female-first.txt");
        testHelpers.initTests();
        nameParserHolder.loadFilesWithPromise("parserTest").then( function () {
            done();
        });
      });

      afterEach(function() {
        // remove specific data
        jQuery("#parserTest").removeData('filelist');
      });

      it("should discover 2 items in data-element when 2 are provided", function() {
        expect(jQuery("#parserTest").data('filelist').split(",").length).toEqual(2);
      });


      it("should result in 2 raw data entries when 2 files are provided", function() {
        expect(nameParserHolder.instanceData.parserTest.rawdata["female-first.txt"]).toBeDefined();
        expect(nameParserHolder.instanceData.parserTest.rawdata["male-first.txt"]).toBeDefined();
      });

  });
  
  describe("when loading 1 data element it should process one correctly", function() {

      beforeEach(function(done) {
        // add data specific to this test
        jQuery("#parserTest").data('filelist',"female-first.txt");
        testHelpers.initTests();
        nameParserHolder.loadFilesWithPromise("parserTest").then( function () {
            done();
        });
      });

      it("should discover 1 item in data-element when 1 is provided", function() {
        expect(jQuery("#parserTest").data('filelist').split(",").length).toEqual(1);
      });

      it("should result in 1 raw data entries when 1 file is provided", function() {
        expect(nameParserHolder.instanceData.parserTest.rawdata["female-first.txt"]).toBeDefined();
      });

      afterEach(function() {
        // remove specific data
        jQuery("#parserTest").removeData('filelist');
      });
  });
});

