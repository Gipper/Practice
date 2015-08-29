describe("ParserTest", function() {
  var testHelpers = {};
  var parserTestDiv;

  beforeEach(function() {
    // setup generic parser div
    parserTestDiv = '<div class="nameParser" id="parserTest"></div>';
    jQuery("#testHolder").append(parserTestDiv);
    // store init helpers
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
  });

 afterEach(function() {
    // tear down test DIV
    jQuery("#parserTest").remove();
  });

  describe("when loading data elements it should process two correctly", function() {

      beforeEach(function() {
        // add data specific to this test
        jQuery("#parserTest").data('filelist',"male-first.txt,female-first.txt");
        testHelpers.initTests();
      });

      afterEach(function() {
        // remove specific data
        jQuery("#parserTest").removeData('filelist');
      });

      it("should retrieve 2 items in data-element when 2 are provided", function() {
        expect(jQuery("#parserTest").data('filelist').split(",").length).toEqual(2);
      });
  });
  
  describe("when loading 1 data element it should process one correctly", function() {

      beforeEach(function() {
        // add data specific to this test
        jQuery("#parserTest").data('filelist',"female-first.txt");
        testHelpers.initTests();
      });

      afterEach(function() {
        // remove specific data
        jQuery("#parserTest").removeData('filelist');
      });

      it("should retrieve 1 item in data-element when 1 is provided", function() {
        expect(jQuery("#parserTest").data('filelist').split(",").length).toEqual(1);
      });
  });
});

