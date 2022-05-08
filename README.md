# Hoboken-Event-Scheduler
CS546 Final Project

Members: Aaron Alfaro, Edmond Ahn, Ryan Gallagher, Ethan Che, Calvin Lyttle

Welcome to our final project, the Hoboken Event Scheduler!
  
  *Run 'npm install' to install -all of the necessary packages.
  
  *Run 'npm run seed' to seed the database with some initial data. The usernames and passwords can be read from the seed file, seed.js (you can use EMAIL = 'test@hbe.com' and PW = 'test'). Depending on when you run the seed script, it may give you an error as our code does not allow you to create events in the past. If this error occurs, you can change the dates of the events in the seed file.
  
  *Finally, run 'npm start'! The website is at: http://localhost:3000

How to navigate the application:

Once on the site, you will be greeted with a welcome/login page where you can either login or navigate to the signup page.

Once signed up/logged in, you will be taken to the home page of the site AKA the all events page.  There is a navbar at the top where you can navigate the application.

-----------------------------------------------------------------------------------------------------

-All Events Page (Home)
This page displays all upcoming events that other users have created.  You can search by search term or filter by event tags on this page to help narrow down which events get displayed.  Each event has a 'See Event' button, which links to a page that shows the event in greater detail and allows the user to register/unregister for the event, leave comments, and provides a link to the event creator's user profile page.

-Create Event Page
This page allows you to create an event for other users to interact with.

-My Registered Events Page
This page displays all events that you are currently registered for.  Once the date for an event has passed, the event will not appear here (it will appear on your profile page).

-Calendar Page
This is a visual representation of the my registered events page.

-User Profile Page (shown in navbar as your first and last name)
This page displays your name, age, and email.  There are three sections on this page: recommended events, past hosted events, and past attended events. The recommended events section appears once there are events to be recommended (see note at the bottom of this README). This page also allows the user to delete their account.

-Logout
This logs the user out.

-----------------------------------------------------------------------------------------------------

Extra Feature (follow users and implement activity feed):
As noted in the "All Events Page" section, individual event pages provide a link to the event creator's page, which has a follow button on it.  You can follow different event creators and once you start to follow them and they start to initiate activity, you can navigate to the "Activity Feed" page to see your activity feed.

-Activity Feed
This feed displays all activity initiated by everyone you are currently following, sorted by time of activity.  The following are constituted as activity: (1) someone you are following follows/unfollows someone else, (2) someone you are following registers/unregisters for an event, and (3) someone you are following creates an event.  Each of these provides a link to page:

1 - links to profile of the person that they followed/unfollowed
2 - links to page of the event that they registered/unregistered for
3 - links to page of the event that they created

-----------------------------------------------------------------------------------------------------

Note: The event recommendation feature of our app works based off of previously attended events. However, our app does not let you create an event in the past. So to see this feature in action, you can: run the seed file; register for an event; manually change the date of that event in MongoDB to have occurred in the past. Doing this will also allow you to see past events attended/hosted in the user profile page.


I pledge my honor that I have abided by the Stevens Honor System.
