/*
	author: edoroskevic
	date: 21/05/2018
	description:
		a basic 'bibliography' app using plain javascript.
		it demonstrates javascript classes, dom manipulation, 
		and use of local store and json apis for data preservation;
	license: MIT
*/

let self = this;

let bookCounter = 0;

let title = document.getElementById('title');
let author = document.getElementById('author');
let isbn = document.getElementById('isbn');
let list = document.getElementById('book-list');
let message = document.getElementById('message');

class Store{
	constructor(){
		this.books;
		this._load();
	}

	_load(){
		let item = localStorage.getItem('books');

		if(item === null){
			this.books = [];
		}
		else{
			this.books = JSON.parse(item);
		}
	}	
	
	_save(){
		localStorage.setItem('books', JSON.stringify(this.books));
	}	

	add(book){
		this._load();
		this.books.push(book);
		this._save();
	}

	remove(book){
		this._load();
		
		let parent = book.parentElement;
		let row = parent.parentElement;
		let target = row.firstElementChild;
		let index = parseInt(target.textContent);	

		this.books.forEach( book => {
			if(book.index === index){
				this.books.splice(index - 1, 1);
			}
		}); 	
			
		this._save();	
	}

	erase(){
		localStorage.clear();
	}
}

class Feedback{
	message(text, status){
		message.style.display = 'block';
		message.textContent = text;

		if(status === 0){
			message.className = 'success';
		}
		else if(status === 1){
			message.className = 'failure';
		}
		else{
			console.log('woops! something went wrong with the message');
		}
		
		setTimeout(() => { message.style.display = 'none'; }, 3000);
	}
}

class Book{
	constructor(title, author, isbn){
		this.title = title;
		this.author = author;
		this.isbn = isbn;
		this.index = bookCounter;
	}
}	

class List{
	add(book){
		let row = document.createElement('tr');
		
		row.innerHTML = `
						<td>${book.index}</td>
						<td>${book.title}</td>
						<td>${book.author}</td>
						<td>${book.isbn}</td>
						<td><a href='#' class='fas fa-times delete'></a></td>
						`;	

		list.appendChild(row);			
	}

	remove(book){
		let entry = book.parentElement;
		let row = entry.parentElement;

		row.remove();
	}		

	erase(){
		while(list.firstChild){
			list.removeChild(list.firstChild);
		}
	}

	clear(){
		title.value = '';
		author.value = '';
		isbn.value = '';
	}
} 

let ui = new List();
let fb = new Feedback();
let ls = new Store();

function load(event){
	let books = ls.books;

	if(books.length > 0){
		 books.forEach( book => {ui.add(book)} );				
	}

	event.preventDefault();
}

function add(event){
	let title = self.title.value;
	let author = self.author.value;
	let isbn = self.isbn.value;

	if(title.length > 0 && author.length > 0 && isbn.length > 0){
		bookCounter += 1;

		let book = new Book(title, author, isbn);
	
		ui.add(book);
		ls.add(book);

		fb.message('success! the book has been added successfully...', 0);
	}
	else{
		fb.message('woops! something went wrong. please try again...', 1);
	}

	ui.clear();

	event.preventDefault();
}

function remove(event){
	let target = event.target;
	
	if(target.classList.contains('delete')){
		bookCounter > 0 ? bookCounter -= 1 : bookCounter = 0;

		ui.remove(target);
		ls.remove(target);
		fb.message('success! the book has been removed successfully...', 0);
	}	
	
	event.preventDefault();
}

function erase(event){
	ui.erase();
	ls.erase();
}

document.addEventListener('DOMContentLoaded', load);	
document.getElementById('book-form').addEventListener('submit', add);	
document.getElementById('book-list').addEventListener('click', remove);
document.getElementById('erase').addEventListener('click', erase);
