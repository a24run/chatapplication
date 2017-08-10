var myapp=angular.module("myapp",[]);
myapp.controller('hello', function($scope,$rootScope){
  var globalUserid=0;
  var socket = io();
  $scope.messages=[]
  $scope.nameForm=true;
  $rootScope.userId=0;  
  $scope.sendName=function(){
    console.log($scope.name);
    console.log( {"name":$scope.name});
    socket.emit('name', {"name":$scope.name});

  };

  // show for new Name and name exists
  $scope.nameNew=false;0
  $scope.nameExists=false;
  $scope.welcomeScreen=false;

  // checking names 
  socket.on('nameValue',function(data){
    console.log(data.userdata);
    $rootScope.user=data.userdata
    globalUserid=data.userdata.id;;
    $scope.$apply(function(){
       if(data.present===1)
        {
          console.log("name Created")
          $scope.nameForm=false;
          $scope.nameExists=false;
          $scope.nameNew=true;
          $scope.welcomeScreen=true;

        }
        else{
          console.log("Name already exists");
          $scope.nameExists=true;
          $scope.nameNew=false;
          $scope.welcomeScreen=false;
        }    
      })
    callindividual();
    });
  socket.on('chatRoom',function(data){
   console.log(data);
    $scope.$apply(function(){
      ($scope.messages).push(data); 
    });  
   console.log("after "+$scope.messages);
  });

  //The number of users 
  socket.on('users',function(data){
    var temp=data;
    $scope.$apply(function(){
          $rootScope.TotalUsers=data;
    });
  })

  // Chat with Each user 
  $scope.chatUser=function(index){
     $rootScope.TotalUsers.forEach(function(index){
      index.activeOrNot="notActive";
      if(index.id==$rootScope.user.id)
      {
        index.activeOrNot="myColor";
      }
     });
    $rootScope.UserChattingWith =$rootScope.TotalUsers[index];
    if(($rootScope.UserChattingWith.messageArray).length!=0)
    {
      $scope.messages=$rootScope.UserChattingWith.messageArray;
      $scope.chatBox=true;
      $scope.welcomeScreen=false;
    }
    else{
        var temp={"name":$rootScope.TotalUsers[index].name,"msg":"SEND ME MESSAGE"}
      $scope.messages=[];
      $scope.messages.push(temp);
        $scope.chatBox=true;
        $scope.welcomeScreen=false;
    }
    console.log(index);
    $rootScope.TotalUsers[index].activeOrNot="active";
    $rootScope.user.activeOrNot="myColor"
  }

  $scope.sendMesage=function(){
    var message={"me":$rootScope.user,"person":$rootScope.UserChattingWith,"msg":$scope.msg};
    socket.emit('UserPersonalRoom',message);
    $scope.msg="";
  };

var callindividual=function(){
  socket.on(($rootScope.user).id,function(data){
    console.log(data)
    if(data.gettingMsgFromThisPerson!=undefined || data.gettingMsgFromThisPerson=="")
    {
      $rootScope.TotalUsers.forEach(function(index){
        if(index.id==data.gettingMsgFromThisPerson.id)
        {
           $scope.$apply(function(){
          index.messageArray.push(data)
          });
        }
      })
    }
    if(data.SendingMsgToThisPerson!=undefined || data.SendingMsgToThisPerson=="")
    {
       $rootScope.$apply(function(){
      $rootScope.TotalUsers.forEach(function(index){
        if(index.id==data.SendingMsgToThisPerson.id)
        {
          index.messageArray.push(data)
        }
      });
      });
    }
    if(data!=null || data!=undefined || data!="")
    {
      if($rootScope.UserChattingWith!= undefined){
         $scope.$apply(function(){
        ($scope.messages)=$rootScope.UserChattingWith.messageArray;
      });
      }
     
    }
  
});
}
});
