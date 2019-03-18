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
			this.books = JSON.parse(self.localStorage.getItem('books'));
		}
	}	

	_save(){
		self.localStorage.setItem('books', JSON.stringify(this.books));
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
}

export class Store;
