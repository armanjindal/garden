---
title: "Ruby"
---

> When you don’t create things, you become defined by your tastes rather than ability. Your tastes only narrow and exclude people. so create.


> "Vitamin R. Goes straight to the head. Ruby will teach you to _express_ your ideas through a computer. You will be writing stories for a machine.
> Creative skills, people. Deduction. Reason. Nodding intelligently. The language will become a tool for you to better connect your mind to the world"

> — Why the Lucky Stiff


I am in the unique and incredibly lucky position to be an intern at 37signals. Formerly known as Basecamp, this tech company which is neither a start up (its been around for 25 years) or big-tech, is where Ruby on Rails, the popular web development framework was developed by the CTO and is everywhere in this company. These are an ongoing note on my experience learning Ruby and the Rails framework from scratch. I am fascinated by this tool for thinking and am looking forward to going deep into it from many angles learning from the best. 

Learning Plan:
1. Crash Course in Rails Syntax
2. The Ruby Programming Language

Concurrently Learn Rails - The Ruby Web App Development Framework
1. Rails Guides
2. Capistrano
3. MRSK Deployment Tool 

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
