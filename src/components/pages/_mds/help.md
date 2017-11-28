# What ? 

This is the guide for using _Tomcat-web-deploy_.

# Why ?

This product was designed for deploying war on Tomcat server. 

Why create  an tool for this ?  

On a mission, my team and me wasd designated microservices. The majority of this services was Java web application. The project must be continuous delivery for users during the developpement of the main software. 

None infrastructure was built for test or dev environnement. An delivery must imply multiples wars. The current process use by other team was to download all wars, connect on the server, stop the server, copy on the machine the wars and restart...
This was very painfull for one update and all new developpers must be know all the machines and the procedure to do this. 

One first solution was to use jenkins console to deploy. One of our problematic was that the continous delivery doesn't fit to the process for the user's test (falsy bugs when an deploy artifact was in progress). The use of the manual jenkins console was contraintfull to go of an item page to another.

The creation of this tool was the response of that problematic.

# How ?

    

# The Getting Started guide.

## Main screen.

![Main Screen](/images/help/Tomcat-Web-Deploy-Main.png)

The main screen is compose by :

* An header menu
* The Server's panel
* The list of all artifact already declare on this instance.

## Add an Artifact

* Click on _Add_ in the header bar. The _Add Artifact_ is must be appear.
* 

## Add an Server

### Server instance configuration

### Declaration

## Deploy an Artifact


