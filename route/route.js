const route=require('express').Router();
const us=require('../schema/user.js')
const passport=require('passport')
const Team=require('../schema/team.js')
const Event=require('../schema/event.js')
var person='';
var count=1;
route.get('/',function(req,res){
  res.send('hello');
})


route.post('/usersignup',(req,res)=>{
  console.log(req.body)
 var use=new us();
 use.fname=req.body.fname;
 use.lname=req.body.lname;
 use.email=req.body.email;
 use.user_id=Math.floor(Math.random()*(1000-1)+1)
 use.password=req.body.password
 use.college=req.body.college
 console.log(use)
 us.findOne({email:use.email}).then((us)=>{
   if(!us)
   {
     use.save().then((used)=>{
       console.log(used+' saved')
     })
   }
   else {
     console.log("User already exist")
   }
 })
})

route.get('/ch',function(req,res){
  res.render('index')
  console.log(req.user)
})

route.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
failureRedirect:"/login",
  failureFlash:true
}));

route.get('/login',function(req,res){
  res.send(req.flash('login'))
})
route.get('/profile',function(req,res){
  person=req.user
res.send(req.user)
})
route.get('/login2',function(req,res){
  res.render('login')
})

route.post('/regfortisimo',function(req,res){
Event.findOne({'team.team_member':person.user_id}).then(function(da){
  if(da)
  {
    res.send("You have already registered for event")
  }
  else
  {
    var team=new Team()
    team.team_id=count;
    count=count+1;
    var temp=team.team_id
    team.save().then(function(tem){
      Team.findOne({team_id:tem.team_id}).then((da)=>{
        console.log(da)
        da.team_member.push(person.user_id);
        da.save();
        var eve=new Event()
          Event.findOne({Name:'ABHIVYAKTI'}).then((even)=>{
            console.log(even)
              if(!even)
              {
                var event2=new Event()
                event2.Name="ABHIVYAKTI"
                event2.eid=Math.floor(Math.random(1000)+1)
                event2.team.push(da)
                event2.save();
                us.findOne({user_id:person.user_id}).then(function(use){
                  use.events.push(event2);
                  use.save()
                })
                console.log(event2)
              }
              else{
                console.log("EVENTS ARE"+even);

                even.team.push(da)
                even.save();
                us.findOne({user_id:person.user_id}).then(function(use){
                  use.events.push(even);
                  use.save()
                })
              }
          })
      })
    });


  }
})
})

route.post('/jointeam',function(req,res){

var fl=0
  Team.findOne({team_id:req.body.team_id}).then(function(tem){
    for(var f=0;f<tem.team_member.length;f++)
    {
      if(tem.team_member[f]===person.user_id)
      {
        fl=1;
        break;
      }
    }
    if(fl==1)
    {
      console.log("Already in team")
    }
    else {
      tem.team_member.push(person.user_id)
      tem.save().then(()=>{
        Event.findOne({'team.team_id':req.body.team_id}).then((tem2)=>{
          var fl=''
          for(var f=0;f<tem2.team.length;f++)
          {
            if(tem2.team[f].team_id===req.body.team_id)
            {
              console.log(tem2.team[f])
              var fl2=0;
                for(var f2=0;f<tem2.team[f].team_member.length;f2++)
                {
                  if(tem2.team[f].team_member===person.user_id)
                  {
                    fl2=1;
                    break;
                  }
                }
                  if(fl2==1)
                  {
                    console.log("Already registered on event")
                  }
                  else {
                  tem2.team[f].team_member.push(person.user_id)
                  tem2.save();
                  }

              break;
            }
          }

        })
      });
    }

  })






})

route.get('/logout',function(req,res){
  req.logout();
  res.redirect('/ch')
})

module.exports=route
