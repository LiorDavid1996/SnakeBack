const User =require("../models/userModel")
const {validateEmail,validateLength} =require("../helpers/validation")
const bcrypt = require("bcrypt");
const {generateToken} =require("../helpers/tokens")



const sortScore = (users)=>{
  return users.sort((a, b) => b.score - a.score)
}
const register = async (req,res)=>{
  console.log(req.body,"8");
    try {
        const {
          firstName,  
          lastName,
          email,
          password
        }=req.body.values
        const score=req.body.bestScore
        if (!validateEmail(email)) {
            return res.status(400).json({
              message: `invalid email address `,
            });
          }

          const check = await User.findOne({ email });
          if (check) {
            return res.status(400).json({
              message:
                "This email address already exists,try with a different email address",
            });
          }
            
    if (!validateLength(firstName, 3, 30)) {
        return res.status(400).json({
          message: "first name must between 3 and 30 characters.",
        });
      }
      if (!validateLength(lastName, 3, 30)) {
        return res.status(400).json({
          message: "last name must between 3 and 30 characters.",
        });
      }
      if (!validateLength(password, 6, 40)) {
        return res.status(400).json({
          message: "password must be at least 6 characters.",
        });
      }  
    const users= await User.find({}).select('-password -email')
      const cryptedPassword = await bcrypt.hash(password, 12);
      const user = await new User({
        firstName,
        lastName,
        email,
        password:cryptedPassword,
        score
      }).save(); 
      const token = generateToken({ id: user._id.toString() }, "7d");
      res.send({
        id:user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        users:sortScore(users),
        token:token,
        message: "Register Success !" 
      })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
   
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const users= await User.find({}).select('-password -email')
    if (!user) {
      return res.status(400).json({
        message:
          "the email address you entered is not connected to an account.",
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Invalid credentials.Please try again.",
      });
    }
    res.send({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      score:user.score,
      users: sortScore(users)
    });
  } catch (error) {
    res.status(500).json({ message: `${error.message} `, });
  }
};

const getAll = async (req,res) => {

  try {
    const user= await User.find({})
    res.send({user})
  } catch (error) {
    
  }
};

const updateScore = async (req,res) => {
  console.log(req.body);
  const { id, score } = req.body;
  try {
    const updatedResult = await User.findByIdAndUpdate(id, { score:score }, { new: true });
    console.log(updatedResult);
    if (!updatedResult) {
      return res.status(404).json({ message: 'Game result not found' });
    }

    res.json({ message: 'Game result updated successfully', result: updatedResult });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
   
}



module.exports={
   register,
    getAll,
    login,
    updateScore
}
// console.log(req.body);
// await model.insertMany(req.body)
// .then(() => res.status(200).json({ success: true, message: "data added successfully" }))
// .catch(err => { res.status(400).json({ success: false, err }) })