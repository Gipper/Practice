describe("ParserTest", function() {
  var instance;
  var parserTestDiv;

      beforeEach(function() {
        // setup generic parser div
        parserTestDiv = '<div class="nameParser" id="parserTest"></div>';
        jQuery("#testHolder").append(parserTestDiv);
        // add data element specific to this test
        parserTestDiv = jQuery(parserTestDiv).add('data-filelist="male-first.txt,female-first.txt"');
        jQuery("#parserTestDiv").replace(parserTestDiv);
        console.log("here");
        });
      });

  it("should find data-element", function() {
        expect(function(){
          return jQuery("#testHolder").data('filelist');
        }).toBeTruthy();
  });

  describe("when fileHasBeenLoaded", function() {
      

  });

  // demonstrates use of spies to intercept and test method calls
  // it("tells the current song if the user has made it a favorite", function() {
  //   spyOn(song, 'persistFavoriteStatus');

  //   player.play(song);
  //   player.makeFavorite();

  //   expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  // });

  //demonstrates use of expected exceptions
  // describe("#resume", function() {
  //   it("should throw an exception if song is already playing", function() {
  //     player.play(song);

  //     expect(function() {
  //       player.resume();
  //     }).toThrowError("song is already playing");
  //   });
  // });
  //});
