const express=require('express')
const router=express.Router()
const Author=require('../models/author')

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
		//res.redirect('authors/${newAuthor.id}')
		res.redirect('authors')
	} catch {
		res.render('authors/new',{
			author:author,
			errorMessage:'Error creating Author!'
		})
	}
})


module.exports=router