# Simple CMS

Simple CMS is developed using nodejs and mongodb. We won't say- it is a complete CMS, rather it is a very simple one. We developed some basic modules like page management, image management etc with an admin panel. We also developed a front end with simple html which fetches data using REST api. You are feel free to extend this cms. We tried to put all the necessary instructions here. 

## Demo

**Admin Panel**

http://ec2-34-207-169-217.compute-1.amazonaws.com:3000

```
Email: admin@example.com
Password: 123456
```

**Front End**

http://ec2-34-207-169-217.compute-1.amazonaws.com/simple-cms



## CMS (Admin Panel)

You will find the admin panel in 'admin' subfolder. However, as the frontend fetches data using only REST api (using ajax), you can also move admin panel to a different folder or domain. This is totally separate from the frontend.

### Prerequisites

We used node 7.7.x and mongo db 3.4.x. We did not test other version, though probably it won't be a problem. If any one face any version related issue, let us know. We used  express js and mongoose in this node project.  

### Installing

Like all other node project, start with this command:

```
npm install
```

This will install all dependencies of the node project. If all are installed correctly, you can run project by this command (Don't forget to run mongo first by 'mongod' command):

```
node app
```

If you face some problem during installation, check troubleshoot section if it is mentioned.

### Running

Node normally assigns port 3000 or 9000. If node is running without problem, you can load the admin panel. (eg: http://localhost:3000)

First page will be login page ofcourse. 

A dummy user should be already created. Try login with this credential:

```
Email: admin@example.com
Password: 123456
```

After successful login, you will be redirected dashboard.

### Modules

We have tried to follow mvc structure in this project. We created controllers, models and views folders. You will find all the folder contains a subfolder named 'admin'. This is because our original plan didn't include REST api. We thought to develop integrated front end. Thats why we tried to separate all admin related codes in admin subfolder. Later we came up with idea of api, but kept this structure for future possible use. All the routing is done in controller. View is 

Feel free to explore demo website. This will help you to understand purpose/use of different modules. At this moment there are mainly 5 modules:

##### 1. Page Manager

Main purpose of this module is enabling admin to post/create static contents/pages. At first you have to create categories. Categories can be anything like : 'Standard Page', 'Blogs' , 'News'. This way you will be able to filter pages category wise which can be helpful to show list of posts in front end for different pages. You can also upload one image per post, might be used as a featured image.

##### 2. Image Manager

Image manager is the common module to manage all images required in the site. It's up to you how you will use it. 

At first you have to create categories. For example: 'Slideshow', 'Gallery' etc. You have to set image width and height for this category. This will be helpful to save image in correct size for each each category.

Then create album under these categories. For example, slideshow might need to be placed in home page and also other inner page like about us. So you can create two albums like 'Home' and 'About Us' and related these two to 'Slideshow' category.

Now you can upload images under each album. You can sort images by dragging them. You can also add additional data like 'Title', 'Description' for each uploaded images as sometimes we need to show image title, caption in website.

All images are uploaded in this folder: 

##### 3. Menu Manager

You can create menu from this module. 

##### 4. User Manager 

You can create new administrator from this menu, also can change/delete existing user. 

##### 5. Settings

There are two sub menus in this section for site settings & email settings. From site settings menu, you can add different information about your site like slogan, logo, copyright text etc. Using email settings menu, you can update email information related with contact form(smtp server, email address with password, port number etc)

## Frontend & REST API

We have developed a sample website using a free bootstrap template to demonstrate how you can fetch data using ajax and backend REST api to prepare the site.

### assets/js/simple_api.js

This file is the core js file where we put all the ajax calls to communicate with backend REST api. In the backend, the api listener is located in controller/simple_api.js which is using another js file to retrieve data from db (helpers/common.js).

At first you should modify js file in frontend and change the api url.  

```
var api_url = "http://localhost:3000/simple_api/";  //change this as necessary. don't remove last portion (simple_api) as this is the route of api
```

You will see there are number of functions for different purposes. Comments are provided.

We used separate js files for each pages. Like home.js, gallery.js etc. Each js file is loaded in each page and they use simple_api.js file's function to fetch data and build up that page.

There is also another js file which is commonly loaded in other pages. It contains some common functions. You will find it here : assets/common.js. Change a server_url variable located here.

```
var server_url = "http://localhost:3000/"; //main url of the node instance
```



## Deployment

Necessary changes in configuration file. + link that will help user to upload their site to AWS

## Possible error & Troubleshooting

- If you face any problem while installing sharp, please install below mentioned things step by step - 

  a) sudo npm install node-gyp -g
  b) sudo apt-get install python
  c) sudo apt-get install make
  d) sudo apt-get install g++
  e) npm install bcrypt --save
  f) npm install sharp

  ​

## Authors

- **[Ashikur Rahman](http://www.ashikrahman.info)**
- **[Md Jobayer Islam](http://jobayerislam.com/)**

See also the list of [contributors](https://github.com/jobayerccj/simple-cms/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://gist.github.com/PurpleBooth/LICENSE.md) file for details

## Acknowledgments

- We used Admin LTE template for admin panel
- We used a template (Business Casual) from start bootstrap 
