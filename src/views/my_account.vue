<template>
  <div id="page-wrapper">
    <div class="inner-content">
      <div class="music-left" style="width: 100%">
        <div class="banner-section">
          <div class="banner">
            <div class="callbacks_container">
              <ul class="rslides callbacks callbacks1">
                <li>
                  <div class="banner-img">
                    <img src="images/22.jpg" class="img-responsive" alt />
                  </div>
                  
                </li>
              </ul>
            </div>

            <div class="clearfix"></div>
          </div>
        </div>
        <div class="container chart-section" ref="account">
          <form action method="post" @submit = "submitProfile">
            <div class="form-group">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="pad_50">
                <tr>
                  <td class="playborder">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="left">
                          <div class="section-title" style="margin-bottom: 0px; margin-top: 20px;">
                            <h3 class="tittle">My Profile</h3>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <label for="title">
                Your Full Name
                <span>Please Enter Full Name</span>
              </label>
              <input type="text" name="fullname" id="title" v-model="profile.fullname" class="form-controll" />
            </div>
            <div class="form-group">
              <label for="title">
                Mobile Number
                <span>Please Enter Mobile Number</span>
              </label>
              <input type="tel" name="mobile" id="mobile" v-model="profile.mobile" class="form-controll" />
            </div>
            <div class="form-group">
              <label for="title">
                Email Address
                <span>Please Enter Valid Email Address</span>
              </label>
              <input type="email" name="email" id="email1" v-model="profile.email" class="form-controll" disabled/>
            </div>
            <div class="form-group">
              <label for="caption">
                Password
                <span>Please Password minimum 8 Character</span>
              </label>
              <input
                type="password"
                name="password"
                value="password"
                id="password3"
                class="form-controll"
                v-model="profile.password"
                
              />
            </div>
            <div class="form-group">
              <label for="caption">
                Confirm Password
                <span>Please Confirm Password minimum 8 Character</span>
              </label>
              <input
                type="password"
                name="password"
                value="password"
                id="password2"
                class="form-controll"
                v-model="profile.conf_password"
               
              />
            </div>
            <div class="form-group">
              <button type="submit">Update</button>
            </div>
          </form>
        </div>
        <!--Playlist End-->
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Account",

  data: () =>({
     profile:{
      fullname: "",
      mobile: "",
      email: "",
      password: "",
      conf_password: "",
     },
      msg: "",
     token: localStorage.getItem("token"),
    
  }), 

  mounted(){
    this.goto('account');
    this.$axios.post("/my_account").then((response) => {
     
     if(this.token == null)
     {
       this.$router.push({ name: "Unauth"} );
     }
     else
     {
       this.profile.fullname = response.data.fullname;
       this.profile.mobile = response.data.mobile;
       this.profile.email = response.data.email;

     }
   });
  },

  methods: {
    async submitProfile(e)
    {
      e.preventDefault();

      if(this.profile.password !== this.profile.conf_password)
      {
        this.$iziToast.error({
              position: "topCenter",
              title: "Error",
              message: "Password and confirm password are not the same.",
            });
        return false;
      }

      try {
        await this.$axios.post("/updateProfile", this.profile).then(response => {
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
          
        } 
        })
      } 
      catch (err) {
        console.log(err);
      }
      
    },

    goto(refName) {
        var element = this.$refs[refName];
        //console.log(element);
        var top = element.offsetTop;
        window.scrollTo(0, top);
    }
  },
};
</script>
