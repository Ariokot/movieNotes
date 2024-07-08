// Function to create pop menu for section control buttons
         
let isSectionPopupVisible = false;
let section_popup_menu;
let section_popup_menu_div;

document.addEventListener('click', function(event) {
    console.log(event.target);
        
    if (event.target.matches('.section-controls')) {
        console.log("section options button clicked");
        if(isSectionPopupVisible && !section_popup_menu.contains(event.target)) {
            //remove popup menu
            section_popup_menu.remove();
            isSectionPopupVisible = false;
        }

        else {
                section_popup_menu_div = document.createElement("div");
                section_popup_menu_div.className = "popup-menu-wrapper";
                section_popup_menu = document.createElement("ul");
                section_popup_menu.className = "section_popup_menu-list";
                section_popup_menu
                let section_options_list;
                 
                // Add diffrent popup options to deferent links 
                if (event.target.id == 'watched-stn-ctls') {
                    console.log(event.target)
                    section_options_list = JSON.parse(document.getElementById('watched-options-list').innerHTML);
                
                }

                else if (event.target.id == "favourite-stn-ctls") {
                        console.log("Favourites sections options")
                        section_options_list = JSON.parse(document.getElementById('favourite-options-list').innerHTML);
                }

                else if (event.target.id == "currentlywatching-stn-ctls") {
                    section_options_list = JSON.parse(document.getElementById('currentlywatching-options-list').innerHTML);
                }

                else if (event.target.id == "watchlist-stn-ctls") {
                    section_options_list = JSON.parse(document.getElementById('watchlist-options-list').innerHTML);
                }

                console.log(typeof(section_options_list))
                console.log(section_options_list)

                let section_options = {}
                section_options_list.forEach(list_item => {
                    section_options[list_item[0]] = list_item[1]
                });
                console.log(section_options)

                let section_list_options = [];
                for (let key in section_options) {
                    let section_popup_options = document.createElement("li");
                    section_popup_options.className = "popup-menu-li";
                    let section_link = document.createElement("a");
                    section_link.href = section_options[key];
                    section_link.innerHTML = key;
                    section_popup_options.appendChild(section_link);
                    section_popup_menu.appendChild(section_popup_options);
                    section_list_options.push(section_popup_options);
                }

                section_popup_menu_div.appendChild(section_popup_menu);
                event.target.parentNode.parentNode.parentNode.insertAdjacentElement('afterend', section_popup_menu_div);
                isSectionPopupVisible = true;

                let section_watched_date = null;
                let section_date_div = document.createElement("div");
                let section_date_lbl = document.createElement("label");
                let section_date = document.createElement("input");
                section_date_lbl.innerHTML = "Include date";
                section_date.type = "date";
                section_date.id = "watched-date"
                section_date_div.appendChild(section_date_lbl);
                section_date_div.appendChild(section_date);
                section_date_div.style.display = "none"
                section_popup_menu.insertAdjacentElement('afterend', section_date_div);

                section_list_options.forEach(list_option => {
                    //console.log(list_option.firstChild.innerHTML)
                    if(list_option.firstChild.innerHTML == "Completed Watching") {
                        console.log("Completed watching found")
                 
                        list_option.addEventListener('mouseover', function() {
                            section_date_div.style.display = "block";
                           
                        });

                        section_date_div.addEventListener('mouseover', function() {
                            section_date_div.style.display = "block";
                        });

                        section_date_div.addEventListener('mouseout', function() {
                            section_date_div.style.display = "none";
                        });

                   }
                })

                //Add event handlers to all links in the list items to send data to the server side
                for(let i = 0; i < section_list_options.length; i++) {
                    section_list_options[i].firstChild.addEventListener('click', function(event) {
                        event.preventDefault();
                        console.log(event.target);

                        let data = {
                            movie_data_id: event.target.parentNode.parentNode.parentNode.previousElementSibling.firstElementChild.innerHTML,
                            movie_title: event.target.parentNode.parentNode.parentNode.previousElementSibling.lastElementChild.firstElementChild.firstElementChild.children[1].innerHTML,
                            movie_year: event.target.parentNode.parentNode.parentNode.previousElementSibling.lastElementChild.firstElementChild.children[1].innerHTML,
                            movie_stars: event.target.parentNode.parentNode.parentNode.previousElementSibling.lastElementChild.firstElementChild.children[2].innerHTML,
                            movie_poster: event.target.parentNode.parentNode.parentNode.previousElementSibling.children[1].firstElementChild.src,
                            movie_poster_sizes: event.target.parentNode.parentNode.parentNode.previousElementSibling.children[1].firstElementChild.sizes,
                            movie_poster_set: event.target.parentNode.parentNode.parentNode.previousElementSibling.children[1].firstElementChild.srcset
                                                           
                            };
                 

                        if (section_list_options[i].firstChild.innerHTML == "Completed Watching") {
                            data.date = section_watched_date;
                            data.data_route = document.getElementsByClassName('route')[0].innerHTML;
                        }

                        console.log(data);
                        let route = section_list_options[i].firstChild
                        console.log(route)
                        fetch(route, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        })
                        .then(response=> response.json())
                        .then(data => {
                            alert(data.message);
                        })
                        .catch((error) => console.error('Error:', error));
                    

                    });
                }  

                // Send data to the back end when section_date is updated
                
                function upDateWatchedDate() {
                        section_watched_date = section_date.value;
                }
                        
                section_date.addEventListener('change', function(event) {
                    console.log("date changing")
                    upDateWatchedDate();
                    console.log(section_watched_date);
                    console.log(event.target);

                    console.log("Watched fetch function after date change")
                    let data = {
                        movie_data_id: event.target.parentNode.parentNode.previousElementSibling.firstElementChild.innerHTML,
                        movie_title: event.target.parentNode.parentNode.previousElementSibling.lastElementChild.firstElementChild.firstElementChild.children[1].innerHTML,
                        movie_year: event.target.parentNode.parentNode.previousElementSibling.lastElementChild.firstElementChild.children[1].innerHTML,
                        movie_stars: event.target.parentNode.parentNode.previousElementSibling.lastElementChild.firstElementChild.children[2].innerHTML,
                        movie_poster: event.target.parentNode.parentNode.previousElementSibling.children[1].firstElementChild.src,
                        movie_poster_sizes: event.target.parentNode.parentNode.previousElementSibling.children[1].firstElementChild.sizes,
                        movie_poster_set: event.target.parentNode.parentNode.previousElementSibling.children[1].firstElementChild.srcset,
                        date: section_watched_date,   
                        data_route: document.getElementsByClassName('route')[0].innerHTML                        
                    }
                    console.log(movie_data_id);
                    console.log(data)

                    fetch("/completed_watch", {
                    method: 'POST',
                    headers: {
                             'Content-Type': 'application/json'
                            },
                    body: JSON.stringify(data)
                    })
                    .then(response=> response.json())
                    .then(data => {
                        alert(data.message);
                    })
                    .catch((error) => console.error('Error:', error));
                });
                watched_date = null;

        }

        
    }

});



// Function for search functions within watched, favourite, currenctly-watching, watchlist and movie-buddies sections
//Step 1: Select the search element using class name
document.addEventListener("DOMContentLoaded", function() {
    let section_search_input = document.getElementsByClassName('section-search');
    console.log(section_search_input);
    console.log(section_search_input.length);
    
    /* Step 2:add click event to selected search element so that when clicked the default view 
    dissapears and div to display search results appears */
    let search_close = document.getElementById('search-close')
    let section_display_tohide;
    let section_search_display;
    let fetch_url;
    
    for (let i = 0; i < section_search_input.length; i++) {
        section_search_input[i].addEventListener('click', function(event) {
        console.log(event.target);
        console.log("section_search input clicked")  

        search_close.style.display = "inline";
        
        // default div view is hidden 
        // conditionals are used to dyamically select the viewed and hidden displays for each section
        
        if (event.target.id == 'watched-movie-search') {
            section_display_tohide = document.getElementById('allwatched-movie-display');            
            console.log(section_display_tohide);
            section_display_tohide.style.display = "none";
                      
        }  
        
        else if (event.target.id == 'favourite-movie-search') {
            section_display_tohide = document.getElementById('favourite-movie-display');            
            console.log(section_display_tohide);
            section_display_tohide.style.display = "none";
        }

        else if (event.target.id == 'currentlyWatching-movie-search') {
            section_display_tohide = document.getElementById('currentlywatching-movie-display');            
            console.log(section_display_tohide);
            section_display_tohide.style.display = "none";
        }

        else if (event.target.id == 'watchlist-movie-search') {
            section_display_tohide = document.getElementById('watchlist-movie-display');            
            console.log(section_display_tohide);
            section_display_tohide.style.display = "none";
        }

        else if (event.target.id == 'movie-buddies-search') {
            section_display_tohide = document.getElementById('movie-buddies-display');            
            console.log(section_display_tohide);
            section_display_tohide.style.display = "none";
        }

      

        });

        
     
        
    // Step 3: input event is then added to the search input
    section_search_input[i].addEventListener('input', async function(event) {
        let search_close = document.getElementById('search-close')
        search_close.style.display = "inline";

           
         
        if (event.target.id == 'watched-movie-search') {
            section_display_tohide = document.getElementById('allwatched-movie-display'); 
            section_search_display = document.getElementById('search-watched-wrapper');        
            console.log(section_display_tohide);
            section_display_tohide.style.display = "none";
            section_search_display.style.display = "block";
            fetch_url = '/search_watched?q='
          
        }

        else if (event.target.id == 'favourite-movie-search') {
            section_display_tohide = document.getElementById('favourite-movie-display'); 
            section_search_display = document.getElementById('search-favourites-wrapper');        
            console.log(section_display_tohide);
            section_display_tohide.style.display = "none";
            section_search_display.style.display = "block";
            fetch_url = '/search_favourites?q='
          
        }

        else if (event.target.id == 'currentlyWatching-movie-search') {
            section_display_tohide = document.getElementById('currentlywatching-movie-display'); 
            section_search_display = document.getElementById('search-currentlyWatching-wrapper');        
            console.log(section_display_tohide);
            section_display_tohide.style.display = "none";
            section_search_display.style.display = "block";
            fetch_url = '/search_currentlyWatching?q='
          
        }

        else if (event.target.id == 'watchlist-movie-search') {
            section_display_tohide = document.getElementById('watchlist-movie-display'); 
            section_search_display = document.getElementById('search-watchlist-wrapper');        
            console.log(section_display_tohide);
            section_display_tohide.style.display = "none";
            section_search_display.style.display = "block";
            fetch_url = '/search_watchlist?q='
          
        }

        else if (event.target.id == 'movie-buddies-search') {
            section_display_tohide = document.getElementById('movie-buddies-display'); 
            section_search_display = document.getElementById('search-moviebuddies-wrapper');        
            console.log(section_display_tohide);
            section_display_tohide.style.display = "none";
            section_search_display.style.display = "block";
            fetch_url = '/search_moviebuddies?q='
          
        }

        // Step 4: use fetch function to send the user query inputed in section search to the server

        

        let response = await fetch(fetch_url + event.target.value);
        let feedback = await response.json();
        console.log(feedback);
        section_search_display.innerHTML = '';
        if (event.target.id == 'movie-buddies-search') {
            for (let dict_item in feedback) {
                //let profile_pic = "../Images/Icons/user_profile.png";
                let id = feedback[dict_item].id;
                let name = feedback[dict_item].full_name;
                let user_name = feedback[dict_item].user_name;
                //let status
                let moviebuddy_container = document.createElement("div");
                moviebuddy_container.className = "moviebuddy_container";

                let moviebuddy_profile = document.createElement("div");
                moviebuddy_profile.className = "moviebuddy_profile";
                let moviebuddy_profilepic = document.createElement("img")
                moviebuddy_profilepic.className = "moviebuddy_profilepic";
                moviebuddy_profilepic.src = "../static/Images/Icons/user_profile.png";
                moviebuddy_profile.appendChild(moviebuddy_profilepic);

                let movie_buddy_info = document.createElement("div");
                movie_buddy_info.className = "moviebuddy_info";
                let moviebuddy_id = document.createElement("p");
                moviebuddy_id.className = "movie-buddy-id";
                moviebuddy_id.innerHTML = id;
                moviebuddy_id.style.display = "none";
                let movie_buddyname = document.createElement("p");
                movie_buddyname.className = "movie-buddyname";
                movie_buddyname.innerHTML = name;
                let movie_buddyuser_name = document.createElement("p");
                movie_buddyuser_name.className = "movie_buddyuser_name";
                movie_buddyuser_name.innerHTML = user_name
                let movie_buddy_status = document.createElement("span");
                movie_buddy_status.innerHTML = '';
                movie_buddyuser_name.appendChild(movie_buddy_status);

                movie_buddy_info.appendChild(moviebuddy_id);
                movie_buddy_info.appendChild(movie_buddyname);
                movie_buddy_info.appendChild(movie_buddyuser_name);
                movie_buddy_info.appendChild(movie_buddy_status)


                moviebuddy_container.appendChild(moviebuddy_profile);
                moviebuddy_container.appendChild(movie_buddy_info);
                
                section_search_display.appendChild(moviebuddy_container);
            }
        }
        else {
            for (let dict_item in feedback) {
                let title = feedback[dict_item].movie_title.replace('<', '&lt;').replace('&', '&amp;');
                console.log(title)
               
                let year = feedback[dict_item].movie_year;
                let stars = feedback[dict_item].movie_stars;
                let poster = feedback[dict_item].movie_poster;
                let posterset = feedback[dict_item].movie_poster_set;
                let movie_container_div = document.createElement("div");
                movie_container_div.className = "movie-info-container";
                let movie_info_text = document.createElement("div");
                movie_info_text.className = "movie_info_text";
                let movie_info_div = document.createElement("div")
                movie_info_div.className = "movie-info"
                let movie_title = document.createElement("h3");
                movie_title.className = "search-movie-title";
                movie_title.innerHTML = title;
                let movie_year = document.createElement("p");
                movie_year.className = "movie-year";
                movie_year.innerHTML = year;
                let movie_stars = document.createElement("p");
                movie_stars.className = ("movie-stars");
                movie_stars.innerHTML = stars;
                let controls = document.createElement("img");
                controls.className = "section-controls";
                if (section_search_display.id == 'search-watched-wrapper') {
                    console.log("Watched section ctls")
                    controls.id ='watched-stn-ctls'
                }
                
                else if (section_search_display.id == 'search-favourites-wrapper') {
                    console.log("Favourite section ctls")
                    controls.id ='favourite-stn-ctls'
                }
    
                else if (section_search_display.id == 'search-currentlyWatching-wrapper') {
                    console.log("Currently watching section ctls")
                    controls.id ='currentlywatching-stn-ctls'
                }
                
                else if (section_search_display.id == 'search-watchlist-wrapper') {
                    console.log("Currently watching section ctls")
                    controls.id ='watchlist-stn-ctls'
                };
    
                controls.src = "../static/Images/Icons/9022327_dots_three_duotone_icon.png";
                let controls_btn = document.createElement("button");
                controls_btn.type = "button";
                controls_btn.className = "controls-btn";
                controls_btn.appendChild(controls);
    
                 
                let movie_poster_div = document.createElement("div");
                movie_poster_div.className= ("movie-poster-div")
                let movie_poster = document.createElement("img");
                movie_poster.src = poster;
                movie_poster.sizes = "50vw, (min-width: 480px) 34vw, (min-width: 600px) 26vw, (min-width: 1024px) 16vw, (min-width: 1280px) 16vw";
                movie_poster.srcset = posterset;
                            
                
               
                movie_poster_div.appendChild(movie_poster);
    
                let movie_title_div = document.createElement("div");
                movie_title_div.className ="movie_info_title_wrapper";
                let empty_title = document.createElement("h3");
                empty_title.className = "empty_title";
                empty_title.innerHTML = "";
                movie_title_div.appendChild(empty_title);
                movie_title_div.appendChild(movie_title);
                movie_info_text.appendChild(movie_title_div);
                movie_info_text.appendChild(movie_year);
                movie_info_text.appendChild(movie_stars);
                movie_info_div.appendChild(movie_info_text);
                movie_info_div.appendChild(controls_btn);
    
                let movie_id = document.createElement("p");
                movie_id.innerHTML = feedback[dict_item].id;
                movie_id.style.display = "none";
                            
                movie_container_div.append(movie_id);
                movie_container_div.appendChild(movie_poster_div);
                movie_container_div.appendChild(movie_info_div);
    
    
                            
                //document.getElementById("search-watched-wrapper").appendChild(movie_container_div);
                section_search_display.appendChild(movie_container_div);
               
                                      
            }

        }
        
              
    });

    // Closing section search by clicking section close button 
    search_close.addEventListener('click', function(event) {
        console.log(event.target)
        console.log("search_close clicked")
        search_close.style.display = "none";
        section_display_tohide.style.display = "block";
        section_search_display.style.display = "none";
        event.target.parentNode.previousElementSibling.value = "";
        console.log(event.target.parentNode.previousElementSibling);
       
    });
}    
});



    /*1. Target search element in DOM
        2. When targeted display the search content window, initial display is hidden
        NB: Display the search results using format of the default views and also with , so use same class names and 
        3.Send request to server using fetch
        4. Close search*/
//};




