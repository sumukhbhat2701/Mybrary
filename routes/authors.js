const express=require('express')
const router=express.Router()
const Author=require('../models/author')
const Book = require('../models/book')

//All authors route->index.ejs in authors folder
router.get('/',async (req,res) => {
	let searchOptions={}
	if(req.query.name!=null && req.query.name!=='')  {     
		searchOptions.name=new RegExp(req.query.name,'i')
	}
	try {
		const authors=await Author.find(searchOptions)
		res.render('authors/index',{
			authors:authors,
			searchOptions: req.query
		})
	} catch {
		res.redirect('/')
	}
})

//New Author route->new.ejs in authors(just display the form)
router.get('/new',(req,res)=>{
	res.render('authors/new',{author : new Author()})  //new database obj
})

//Create new author route->no new file required(Create the file)
router.post('/',async (req,res)=>{   //We set async and await for any errors or not
	const author=new Author({
		name:req.body.name
        })
	try{
		const newAuthor=await author.save()
		res.redirect(`authors/${newAuthor.id}`)
	} catch {
		res.render('authors/new',{
			author:author,
			errorMessage:'Error creating Author!'
		})
	}
})

//Show all Authors
router.get('/:id',async (req,res) => {
	try{
		const author = await Author.findById(req.params.id)
		const books = await Book.find({author:author.id}).limit(6).exec()
		res.render('authors/show',{
			author:author,
			booksByAuthor:books
	})
}	catch {
			res.redirect('/')
		}
})

//Show options to edit
router.get('/:id/edit',async  (req,res) => {
	try{
		const author = await Author.findById(req.params.id)
		res.render('authors/edit',{author:author})
	} catch {
		res.redirect('/authors')
	}
	
})

//Edit
router.put('/:id',async (req,res) => {
	let author={}
	try{
		author = await Author.findById(req.params.id)
		author.name = req.body.name
		await author.save()
		res.redirect(`/authors/${author.id}`)
	} catch {
		if(author == null) {
			res.redirect('/')
		}else{
			res.redirect('authors/edit',{
				author:author,
				errorMessage:'Error Updating Author!'
			})
		}
	}
})

//Delete
router.delete('/:id',async (req,res) => {
	let author={}
	try{
		author = await Author.findById(req.params.id)
		await author.remove()
		res.redirect('/authors')
	} catch {
		if(author == null) {
			res.redirect('/')
		}else{
			res.redirect(`/authors/${author.id}`)
		}
	}
})

module.exports=router