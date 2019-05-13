//document.addEventListener("DOMContentLoaded", function () {} === the same as the line below...
$(document).ready(function () {

   const NYT_API_LINK = "https://api.nytimes.com/svc/topstories/v2/"
   const NYT_API_LAST_PART = ".json?api-key="
   const NYT_KEY = "WJGgFUA46EgQAmONzRmsZ10lzaNOd9I1"
   const IMG_REPLACE = "http://jewel1067.com/wp-content/uploads/news.jpg"


   $('select').selectric();

   $(".selectSection").on("change", function () {

      // $.getJSON(`${NYT_API_LINK}` + `${NYT_KEY}`,

      //    function () {
      //       // Here is the succes property wjich we used in the Ajax form (let's see exo-17-1)
      //    })
      let $searchedSection = $(".selectSection option:selected").val();

      let fullURL = `${NYT_API_LINK}${$searchedSection}${NYT_API_LAST_PART}${NYT_KEY}`

      $.ajax({
         method: 'GET',
         url: fullURL,
         success: function () {
            $('.loader').append("<img src='images/ajax-loader.gif' alt='loading'>")
         }
      })


         .done(function (data) {

            setTimeout(function () {
               $('.loader').html("");
               console.log(data);
               let subSections = [];
               $.each(data.results, function (index, value) {
                  // let subsection1 = data.results[index].section;

                  subSections.push(data.results[index].section)

                  //  console.log(subsection1);
                  //  let $btn = `<button>${subsection1}</button>`;
                  //  $('.topStories').append($btn);
               });

               let $ts = $('.topStories');
               $ts.html("");

               let $titleSelectElement = `<h6 class="titleSubSection">Choose a sub-section:</h6>`;
               let $selectElement = `<select name="subSections" class="selectSubSection"></select>`;


               //Remove unecessary elements at the begining
               $('.titleSubSection').next().remove();

               if ($('.mainTitle').next().next().hasClass('topStories')) {
                  // Do Nothing;
               }
               else {
                  $('.mainTitle').next().next().remove();
               }

               $('.mainTitle').next().after($titleSelectElement + $selectElement);
               //END Remove unecessary elements at the begining

               //Add New Select (for sub-sections) to the header
               console.log($('.mainTitle').next());
               $('.selectSubSection').append(`<option value="All">All</option>`);

               //Add elements to the New Select (for sub-sections)
               $.each($.distinct(subSections), function (i, v) {

                  $('.selectSubSection').append(`<option value="${v}">${v}</option>`)
               })
               //END Add elements to the New Select (for sub-sections)

               // Repositioning this part into mediaqueries
               $(".mainTitle").css("grid-row", "2/3");
               $(".selectric-selectSection").css("grid-row", "3/4");
               //End of repositioning

               $('select').selectric('refresh'); //SELECTRIC
               $(".selectSubSection").on("change", function (event) {

                  let $subSectionSelected = $(".selectSubSection option:selected").val();
                  $ts.html("");
                  //    // let txt = $(event.target).html();
                  console.log(`You clicked on ${$searchedSection} and on `);
                  console.log(`You clicked on ${$subSectionSelected}`);

                  let num = 0;


                  function checkImg(pArt) {
                     let imgURL = IMG_REPLACE;
                     test = 0;

                     for (let index = pArt.multimedia.length - 1; index >= 0; index--) {
                        if (pArt.multimedia[index].url === "") {
                           //Choose imgURL[index-1];
                           if (index === 0) {
                              imgURL = IMG_REPLACE;
                              break;
                           }
                           else if (pArt.multimedia[index - 1].url === "") { //index !== 0 and url is empty, Then continue.
                              imgURL = IMG_REPLACE;
                           }
                           else {
                              imgURL = pArt.multimedia[index - 1].url;
                              test = index - 1;
                              break;
                           }

                        }
                        else {
                           //Choose imgURL[];
                           imgURL = pArt.multimedia[index].url;
                           test = index;
                           break;
                        }
                     }
                     console.log(`pArt.multimedia[${test}]`);
                     return imgURL;
                  }

                  function setArticles(index, article, sectionTag) {
                     let img = "";

                     img = checkImg(article);
                     // TODO: Fix the flex prop here...
                     // sectionTag.append(`<a href="${article.url}"><article class="art${index} eachArticle"><p class="abstract">${article.abstract}</p></article></a>`);
                     sectionTag.append(`<article class="art${index} eachArticle"><a href="${article.url}"><p class="abstract initialShown">${article.abstract}</p></a></article>`);
                     // sectionTag.append(`<article class="art${index} eachArticle"><p class="abstract">${article.abstract}</p></article>`);
                     $(`.art${index}`).css("background-image", `url("${img}")`);
                     $(`.art${index}`).css("background-size", 'cover');
                     $(`.art${index}`).css("background-position", 'center');
                     $(`.art${index}`).css('height', "400px");
                     $(`.art${index}`).css('display', "flex");
                     $(`.art${index}`).css('align-items', "flex-end");
                     $(`.art${index} p`).css("background-color", "rgba(0, 0, 0, 0.6)");
                     $(`.art${index} p`).css("margin-bottom", "0");
                  }

                  $.each(data.results, function (i, v) {

                     if ($subSectionSelected === v.section) {
                        num += 1;

                        setArticles(i, v, $ts);
                     }
                     if ($subSectionSelected === 'All') {
                        num += 1;

                        setArticles(i, v, $ts);
                     }
                  })
                  console.log(num);

                  //Repositioning of the header
                  $(".logo-select").addClass("animHeader");
                  $(".logo").addClass("animLogo");
                  //END Repositioning of the header


               })
            }, 200)




         });

      $(".topStories").on("mouseover", ".eachArticle", function (event) {
         // let str = $(event.target).find('p').html();
         // console.log(str);
         let $str = $(event.target).find('p');
         // $(event.target).find('p').show();
         $str.removeClass("moveDownx");
         $str.addClass("moveUpx");
         $str.removeClass("initialShown");
      });

      $(".topStories").on("mouseenter", "p", function (event) {
         // let str = $(event.target).find('p').html();
         // console.log(str);
         let $str = $(event.target);
         // $(event.target).find('p').show();
         $str.removeClass("moveDownx");
         $str.addClass("moveUpx");
         $str.removeClass("initialShown");
      });


      $(".topStories").on("mouseleave", ".eachArticle", function (event) {
         // let str = $(event.target).find('p').html();
         // console.log(str);
         let $str = $(event.target).find('p');
         $str.removeClass("moveUpx");
         $str.addClass("moveDownx");
         $str.addClass("initialShown");
         // $(event.target).find('p').hide();
      });

      $(".topStories").on("mouseleave", "p", function (event) {
         // let str = $(event.target).find('p').html();
         // console.log(str);
         let $str = $(event.target);
         $str.removeClass("moveUpx");
         $str.addClass("moveDownx");
         $str.addClass("initialShown");
         // $(event.target).find('p').hide();
      });




   });


});

// $(".my-list").on("click", ".delete", function (event){
//    // let $eltToCrossOff = $(event.target).prev().text();
//    let $eltToCrossOff = $(event.target).prev().css("text-decoration", "line-through");
//    console.log($eltToCrossOff);
// });