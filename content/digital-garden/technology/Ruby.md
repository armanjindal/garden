---
title: "Ruby"
---
# My Learning Path 🗺️
An ongoing catalog of tutorials, paid or otherwise, that go into learning Ruby and the Rails framework. 

> When you don’t create things, you become defined by your tastes rather than ability. Your tastes only narrow and exclude people. so create.

> "Vitamin R. Goes straight to the head. Ruby will teach you to _express_ your ideas through a computer. You will be writing stories for a machine.

> Creative skills, people. Deduction. Reason. Nodding intelligently. The language will become a tool for you to better connect your mind to the world"

— why the lucky stiff


I am in the unique and excellent position of DevOps intern at 37signals. Formerly known as Basecamp, this tech company — neither a start up (its been around for 25 years) or big-tech (~70 people) — is where **Ruby on Rails**, the popular web development framework was developed. The CTO, David Hannimier Hanson (DHH) as he is known on the internet is the frameworks original creator. Though many think it is dead, that doesn't seem to be true, and though it is not the newest or sexiest framework, it is designed intentionally. 

Its taste network — the people who love it — are often people I am inspired by. It is also a question of place. I so happen to be at the Rails mecca. The company is steeped in Ruby and Ruby on Rails is the language. I want to get in on it and learn from the people who developed it to make their lives easier. 

These are an ongoing note on my experience learning Ruby and the Rails framework from scratch. This is my first time really learning a web-app development framework, and my first time going deep on a language. I plan to add a little bit everyday and at some time point turn this into a more readable. This is not a **tutorial** but a **map** of my journey through Ruby & Rails. 

Right now it is what it is an evolving note, filled with quirky reminders about the language. Its also my crash course as I begin to program in it at work and dive deeper into the language and community. I will be at RailsWorld October 5th-6th, 2023 in Amsterdam, so I got to ask some good questions! 

Learning Plan:
1. Crash Course in Rails Syntax ✅
2. Ruby - Pragmatic Studio

Concurrently Learn Rails - The Ruby Web App Development Framework
1. Rails Guide ✅
2. DHH's blog walkthrough ✅
3. Pragmatic Studios - Rails 7 Tutorial ✅
4. Capistrano 
5. Kamal Deployment Tool  ✅

Resources:
- [Ruby Toolbox](https://www.ruby-toolbox.com/) - Overview of open source libraries that solve common problems for Ruby 


## Rails Guide:

## High Level Overview
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

- A different kind of *Model* - A Ruby class used to represent data. Also interacts with app db through *Active Record.* They are the templates of a single record in a database (this is why it is always SINGULAR)


> Active Record is the M in [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) - the model - which is the layer of the system responsible for representing business data and logic. Active Record facilitates the creation and use of business objects whose data requires persistent storage to a database.

- Object Relational Mapping is a fancy term of 


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

## Proc
- Procs are callable objects. 

## Hotwire
- Problem: Every interaction with the app requires a full page refresh. Full pages of HTML, generated by the view templates are being sent, recived, parsed and rendered when much of the page is unaffected. So Hotwire offers three distinct services which progressively narrow down what is rendered without JavaScript. 

1. Turbo Drive: Uses async Java Requests (AJAX) to keep the `head` portion the same, only re-renders the `body`
2. Turbo Frames: Allows you to specify the exact frame to update, so instead of the whole `body` it specifies the exact `turbo_frame`
3. Turbo Streams: Allows you to update multiple frames (instead of just one) and divs (so long as you can target by ID).

- Allows you to enclose sections of HTML pages into tags. 

> Turbo Frames are fairly restrictive in that they can only update one DOM element and it must be a `turbo-frame` with a matching DOM ID. You could think of a Turbo Frame as being like a paring knife that neatly cuts out part of a page.

> Turbo Streams, by contrast, are more versatile. They can change multiple DOM elements in seven different ways (see below) and those elements need not be Turbo Frames. The target of a Turbo Stream can be any HTML element that has a unique DOM ID. In this way, a Turbo Stream is more like a Swiss Army Knife: it can cut, saw, tweeze, crimp, etc. pretty much anything you put in its way.


Source: Pragmatic Studio - Hotwire Course

# Swift + iOS crash course for Ruby + Rails Developers 
By: [Joe Masilotti](https://www.youtube.com/@joemasilotti) - [Video](https://www.youtube.com/@joemasilotti)

- Ruby:
	- Duck typing: looks like a duck, quacks like a duck, we can throw these objects into an array and call the shared method on them.
- Swift:  
	- Strongly typed
	- `let` for variable assignment makes it immutable (sorta like const)
	- When you look up things in dictionary by key, it may or may not be a there, so the type is of `String?` which means it could be null. You can deal with this in three ways:  dangerously (will lead to runtime error) with a `!`, null coalesce with `??` or with an `if/let` construction.    
	- we use `protocol` to define the interface, which is the function name and the return type.  
		- Syntax: `func name -> TYPE `
		- Can also use `extension` on a class to directly implement an interface. You don't need to find the source code. Allows you to override the 
- iOS:
	- Also use a MVC (Model-View-Controller)  except the View and Controller logic are tightly coupled. 
	- Every window/scene is managed by a `ViewController` which is like View & Controller logic of Rails in one. 
	- To make a button do things - we use a clickevent - callHandler:
		- who do you want to 
	- NavigationViewController - How we manage the screens we see on an app. It is organized lack a stack and slides in from the right of the screen to the left by default. 
	- Mod