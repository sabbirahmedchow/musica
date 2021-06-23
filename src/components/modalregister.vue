<template>
  <div class="modal fade" id="myModal5" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content modal-info">
        <div class="modal-header">
          <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body modal-spa">
          <div class="sign-grids">
            <div class="sign">
              <div class="sign-left">
                
              <form action="#" method="post" id="loginForm">
                <h3>Sign In</h3>
                <fieldset id="body">
                  <fieldset>
                    <label for="email">Email Address</label>
                    <input type="text" name="email" id="email" v-model="loginuser.loginEmail" />
                  </fieldset>
                  <fieldset>
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" v-model="loginuser.loginPassword" />
                  </fieldset>
                  <input type="button" id="login" value="Sign in" @click="login" /><br/><br/>
                  <span>
                  <a href="#">Forgot your password?</a>
                </span>
                </fieldset>
                
              </form>
            
              </div>
              <div class="sign-right">
                <form action="" method="post">
                  <h3>Create your account</h3>
                  <label for="name">Name</label>
                  <input
                    v-model = "register.name"
                    type="text"
                    value="Name"
                    onfocus="this.value = '';"
                    onblur="if (this.value == '') {this.value = 'Name';}"
                    required
                  />
                  <label for="number">Phone</label>
                  <input
                    v-model = "register.number"
                    type="text"
                    value="Mobile number"
                    onfocus="this.value = '';"
                    onblur="if (this.value == '') {this.value = 'Mobile number';}"
                    required
                  />
                  <label for="email">Email Address</label>
                  <input
                    v-model = "register.email"
                    type="text"
                    value="Email id"
                    onfocus="this.value = '';"
                    onblur="if (this.value == '') {this.value = 'Email id';}"
                    required
                  />
                  <label for="password">Password</label>
                  <input
                    v-model = "register.password" 
                    type="password"
                    value="Password"
                    onfocus="this.value = '';"
                    onblur="if (this.value == '') {this.value = 'Password';}"
                    required
                  />

                  <input type="button" @click="userReg" value="CREATE ACCOUNT" />
                </form>
              </div>
              <div class="clearfix"></div>
            </div>
            <p>
              By logging in you agree to our
              <span>Terms and Conditions</span> and
              <span>Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Register",
  data: () =>({
    register:{
      name: "",
      number: "",
      email: "",
      password: ""
     },
     msg: "",
     loginuser: {
      loginPassword: "",
      loginEmail: "",
    },
    
  }), 

   
  methods: {
    async userReg() {
      
      if(this.register.name == "" || this.register.number == "" || this.register.email == "" || this.register.password == "")
      {
        this.$iziToast.error({
              position: "topCenter",
              title: "Error",
              message: "Please fill out every field of the form.",
            });
        return false;
      }
      try {
        await this.$axios.post("/addUser", this.register).then(response => {
          if(response.data.msgError != null)
          {
            this.$iziToast.error({
                position: "topCenter",
                title: "Error",
                message: response.data.msgError,
              });
          return false;
          }
        else
        {
          this.$iziToast.success({
              position: "topCenter",
              title: "Success",
              message: response.data.msgSuccess,
            });
          localStorage.setItem("token", response.data.accessToken);
          localStorage.setItem("refreshtoken", response.data.refreshToken);
          this.$axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("token");  
          
          this.$eventBus.$emit("changeLogin", true);
          document.getElementById('close').click();
          this.clear();
        } 
        })
      } 
      catch (err) {
        alert(err);
      }
    },

    async login(){
       if (!this.loginuser.loginEmail) {
        this.$iziToast.error({
              position: "topCenter",
              title: "Error",
              message: "Enter your email address.",
            });
        return false;
        } else if (!this.validEmail(this.loginuser.loginEmail)) {
          this.$iziToast.error({
              position: "topCenter",
              title: "Error",
              message: "Please enter a valid email address.",
            });
          return false;
        }
        if (!this.loginuser.loginPassword) {
        this.$iziToast.error({
              position: "topCenter",
              title: "Error",
              message: "Enter your password.",
            });
        return false;
        }
     
      await this.$axios.post("/login", this.loginuser).then((response) => {
        if(response.data.msgError != null)
        {
          this.$iziToast.error({
              position: "topCenter",
              title: "Error",
              message: response.data.msgError,
            });
        return false;
        }
        else
        {
          if (response.data.accessToken != null) {
            this.$iziToast.success({
              position: "topCenter",
              title: "Success",
              message: response.data.msgSuccess,
            });
            //console.log(response.data.accessToken);
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("refreshtoken", response.data.refreshToken);
            this.$axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("token");
            
 
  
            this.$eventBus.$emit("changeLogin", true);    
            document.getElementById('close').click();
            //this.$router.push({ name: "dashboard" });    
          }
        }
      });
    },

    validEmail: function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

    clear() {
      this.register.name = " ";
      this.register.number = " ";
      this.register.email = " ";
      this.register.password = " ";
    }
  },
};

</script>
