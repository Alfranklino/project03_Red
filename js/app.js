//document.addEventListener("DOMContentLoaded", function () {} === the same as the line below...
$(document).ready(function () {


   const NYT_API_LINK = "https://api.nytimes.com/svc/topstories/v2/"
   const NYT_API_LAST_PART = ".json?api-key="
   const NYT_KEY = "WJGgFUA46EgQAmONzRmsZ10lzaNOd9I1"
   const IMG_REPLACE = "http://jewel1067.com/wp-content/uploads/news.jpg"

   $(".selectSection").on("change", function () {

      // $.getJSON(`${NYT_API_LINK}` + `${NYT_KEY}`,

      //    function () {
      //       // Here is the succes property wjich we used in the Ajax form (let's see exo-17-1)
      //    })
      let $searchedSection = $(".selectSection option:selected").val();
      let fullURL = `${NYT_API_LINK}${$searchedSection}${NYT_API_LAST_PART}${NYT_KEY}`

      $.ajax({
         method: 'GET',
         url: fullURL
      })


         .done(function (data) {

            console.log(data);
            let subSections = [];
            $.each(data.results, function (index, value) {
               // let subsection1 = data.results[index].section;

               subSections.push(data.results[index].section)

               //  console.log(subsection1);
               //  let $btn = `<button>${subsection1}</button>`;
               //  $('.topStories').append($btn);
            });

            let $ts = $('.topStories')
            $ts.html("");

            let $titleSelectElement = `<h6 class="titleSubSection">Choose a sub-section</h6>`;
            let $selectElement = `<select name="subSections" class="selectSubSection"></select>`;

            $('.titleSubSection').next().remove();

            if ($('.selectSection').next().hasClass('topStories')) {
               // Do Nothing;
            }
            else {
               $('.selectSection').next().remove();
            }

            $('.selectSection').after($titleSelectElement + $selectElement);
            $('.selectSubSection').append(`<option value="All">All</option>`);

            $.each($.distinct(subSections), function (i, v) {

               $('.selectSubSection').append(`<option value="${v}">${v}</option>`)
            })

            $(".selectSubSection").on("change", function (event) {

               let $subSectionSelected = $(".selectSubSection option:selected").val();
               $ts.html("");
               //    // let txt = $(event.target).html();
               console.log(`You clicked on ${$searchedSection} and on `);
               console.log(`You clicked on ${$subSectionSelected}`);

               let num = 0;


               function checkImg(pArt) {
                  let imgURL = "..";
                  test = 0;

                  for (let index = pArt.multimedia.length - 1; index >= 0; index--) {
                     if (pArt.multimedia[index].url === "") {
                        //Choose imgURL[index-1];
                        if (index === 0) {
                           imgURL = IMG_REPLACE;
                           break;
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
                  sectionTag.append(`<article class="art${index} eachArticle"><a href="${article.url}"><p class="abstract">${article.abstract}</p></a></article>`);
                  // sectionTag.append(`<article class="art${index} eachArticle"><p class="abstract">${article.abstract}</p></article>`);
                  $(`.art${index}`).css("background-image", `url("${img}")`);
                  $(`.art${index}`).css("background-size", 'cover');
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
               
            })

         });
   });


});

// $(".my-list").on("click", ".delete", function (event){
//    // let $eltToCrossOff = $(event.target).prev().text();
//    let $eltToCrossOff = $(event.target).prev().css("text-decoration", "line-through");
//    console.log($eltToCrossOff);
// });