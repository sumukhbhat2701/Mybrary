const mongoose=require('mongoose')

const authorSchema = new mongoose.Schema({             //Schema like a is database table
	name: {
		type: String,
		required: true
	}
})
module.exports=mongoose.model('Author',authorSchema) 