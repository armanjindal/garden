---
title: "Ruby"
---

> When you don’t create things, you become defined by your tastes rather than ability. Your tastes only narrow and exclude people. so create.

> "Vitamin R. Goes straight to the head. Ruby will teach you to _express_ your ideas through a computer. You will be writing stories for a machine.

> Creative skills, people. Deduction. Reason. Nodding intelligently. The language will become a tool for you to better connect your mind to the world"

— why the lucky stiff


I am in the unique and incredibly lucky position to be an intern at 37signals. Formerly known as Basecamp, this tech company — neither a start up (its been around for 25 years) or big-tech (80 people) — is where Ruby on Rails, the popular web development framework was developed. Ruby and Ruby on Rails is the language and I get to learn it from people who are heavily involved in its production. 

These are an ongoing note on my experience learning Ruby and the Rails framework from scratch. This is my first time really learning a web-app development framework, and my first time going deep on a language. I plan to add a little bit everyday and then after the internship turn this into something more readable. Right now it is what it is. 

Learning Plan:
1. Crash Course in Rails Syntax ✅
2. The Ruby Programming Language — slow burn (Chapter 5.3, pg 140)

Concurrently Learn Rails - The Ruby Web App Development Framework
1. Rails Guide
2. DHH's famous blog walkthrough
3. Capistrano
4. MRSK Deployment Tool 

Resources:
- [Ruby Toolbox](https://www.ruby-toolbox.com/) - Overview of open source libraries that solve common problems for Ruby users

Rails:
- A webapp development framework written in Ruby
- Assumes what every developer needs therefore allows you to do a lot with a little code. 
- Rails Way:
	- DRY (Don't Repeat Yourself)
	- Convention over Configuration - (reasonable defaults you can modify later if you need)
- Follow the Model-View-Controller (MVC) software design pattern:
	- User interacts with Controller --> Manipulates the Model --> Updates the View, which the User then sees.
	- Came from the development of Graphical User Interfaces now used for designing web-applications. 
- Model View Controller:
	- **Model** - Represents the dynamic data of a site. For Rails and Django, this is often the applications database.
	- **Controllers**  - Receives user input and converts it to commands for the Model.
	- **View** - In charge of rendering the object to the User. In Rails often an HTML Template. 

- A different kind of *Model* - A ruby class used to represent data. Also interacts with app db through *Active Record.* They are the templates of a single record in a database (this is why it is always SINGULAR)

- In the Article controller in the index method, we set @articles = Article.all. The instance variable of the controller holds the record of all the articles from the database. Then in the `app/view/articles/index.html.erb` we can access the `@arrticles` variable.
- ERB - Ruby templating file, that allows you to mix 
	- <% %> tags just run the ruby code
	- <%= %> run ruby code and **renders return value into the tags**
	- Convention is to keep this code short for readability

- *Validations* for handling invalid user input when allowing a user to create an input. This takes place in the `app/model/{resource}` directory

Routing Rules:
- `config/routes.rb`
	- Provides a way to capture parameters from the request
```rb
Rails.application.routes.draw do
get "/articles", to: "articles#index"
get "/articles/:id", to: "articles#show"
end
```

- Resourceful Routing:
> Whenever we have such a combination of routes, controller actions, and views that work together to perform CRUD operations on an entity, we call that entity a _resource_. For example, in our application, we would say an article is a resource. 




- A concern is only responsible for a focused subset of the model's responsibility; the methods in our concern will all be related to the visibility of a model.


- Rails by default uses Import Maps, which allows us to use javascript without Node installed. ESM to render the JS.
- With Turbo and Stimulus framework
- Content Delivery Network (CDN) -> For commonly used packages, instead of storing these files on users computers they are cached *by locale* so that web applications can be more performant.

[What is an import map](https://eagerworks.com/blog/import-maps-in-rails-7)? 
- A new feature in Rails 7 that allows developers to import Javascript modules without the pain of configuring npm. 

## Deployment tools:
- Capistrano: 
- MRSK:


## Philosophy 

How to become a better programmer:
- Read a lot of software
	- `bundle open <gem>`
	- Read SHIT too. 
	- All about clarity. How could this be clearer? Re-write it. 
	- Problem with unclear code IS NOT just about applying pattern.
	- Clarity & Readability: as the number 1 priority. It makes a lot of downstream decisons easier. 
- Write a lot of software

> I didn't have time to write a short letter, so I wrote a long one instead.
> — Mark Twaine

- Think of writing good software as a draft. Iterative process. 
- All my first drafts are terrible. Wrote something down as you are figuring things out. 
- Once you write something down, Ommitting needless concepts, patterns, classes, useless patterns that are not getting you closer to the 
- Read, Write, Re-Write.
- Write software well. 
