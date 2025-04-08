<!DOCTYPE html>
<html lang="zxx" >
<head>

    <link rel="icon" href="{{asset('images/1-edited-ai-reference.png')}}" type="image/gif" sizes="16x16">
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="width=device-width, initial-scale=1.0" name="viewport" >
    <meta content="Gardyn — Garden and Landscape Website Template" name="description" >
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title> Raymoch | Register | Admin </title>
    <meta content="" name="keywords" >
    <meta content="" name="author" >
    <style>
        .fade-out {
            opacity: 0;
            transition: opacity 1s ease-out;
        }

    .img-fluid  {
        position: relative;
        height: 100%;
        overflow: hidden;
    }

    .img-fluid  img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .color-overlay {
      position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        pointer-events: none;
        z-index: 1;
        opacity: 0.2;
        background: linear-gradient(120deg, rgba(255, 0, 150, 0.5), rgba(0, 204, 255, 0.5));
        background-size: 400% 400%;
        animation: gradientShift 15s ease infinite, fadePulse 6s ease-in-out infinite;
        mix-blend-mode: overlay;
        border-top-left-radius: .5rem;
        border-bottom-left-radius: .5rem;
    }
    @keyframes gradientShift {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    @keyframes fadePulse {
        0%, 100% {
            opacity: 0.15;
        }
        50% {
            opacity: 0.4;
        }
        .rotate-on-hover {
        transition: transform 0.6s ease;
    }

    .rotate-on-hover:hover {
        transform: rotate(8deg);
    }
    }

    .raymoch-object {
        position: absolute;
        font-size: 1.2rem;
        font-weight: bold;
        padding: 6px 14px;
        border-radius: 12px;
        white-space: nowrap;
        color: #fff;
        background: linear-gradient(45deg, #ff6ec4, #7873f5, #4fd1c5);
        background-size: 600% 600%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: rainbowShift 6s ease-in-out infinite, spin 1.2s linear infinite;
        z-index: 2;
    }

    .raymoch-1 {
        top: 15%;
        left: -200px;
        animation-name: rainbowShift, spin, moveRaymoch1;
        animation-duration: 6s, 1.2s, 10s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out, linear, linear;
    }

    .raymoch-2 {
        top: 40%;
        left: -250px;
        animation-name: rainbowShift, spin, moveRaymoch2;
        animation-duration: 6s, 1.2s, 12s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out, linear, linear;
    }

    .raymoch-3 {
        top: 65%;
        left: -300px;
        animation-name: rainbowShift, spin, moveRaymoch3;
        animation-duration: 6s, 1.2s, 14s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out, linear, linear;
    }

    @keyframes moveRaymoch1 {
        0% { transform: translateX(0); opacity: 0; }
        10% { opacity: 1; }
        50% { transform: translateX(100%); }
        90% { opacity: 1; }
        100% { transform: translateX(140%); opacity: 0; }
    }

    @keyframes moveRaymoch2 {
        0% { transform: translateX(0); opacity: 0; }
        20% { opacity: 1; }
        60% { transform: translateX(110%); }
        90% { opacity: 1; }
        100% { transform: translateX(150%); opacity: 0; }
    }

    @keyframes moveRaymoch3 {
        0% { transform: translateX(0); opacity: 0; }
        15% { opacity: 1; }
        70% { transform: translateX(90%); }
        90% { opacity: 1; }
        100% { transform: translateX(130%); opacity: 0; }
    }

    @keyframes rainbowShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>


<!-- Auto-dismiss after 5 seconds -->
<script>
    setTimeout(() => {
        const alert = document.getElementById('login-alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
</script>

<link rel="stylesheet" href="{{ asset('https://unpkg.com/bootstrap@5.3.3/dist/css/bootstrap.min.css')}}">

<!-- Login 8 - Bootstrap Brain Component -->
<section class="bg-light p-3 p-md-4 p-xl-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-xxl-11">
          <div class="card border-light-subtle shadow-sm">


            <div class="row g-0">
              <div class="col-12 col-md-6 rotate-on-hover">
                <img class="img-fluid rounded-start   w-100 h-100 object-fit-cover" loading="lazy" src="{{ asset('images/1-edited-ai.jpg') }}" alt="Welcome back you've been missed!">
                <div class="color-overlay"></div>
                <div class="raymoch-object raymoch-1">Raymoch</div>
        <div class="raymoch-object raymoch-2">Raymoch</div>
        <div class="raymoch-object raymoch-3">Raymoch</div>
            </div>



              <div class="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <div class="col-12 col-lg-11 col-xl-10">
                  <div class="card-body p-3 p-md-4 p-xl-5">
                    <div class="row">
                      <div class="col-12">

                        <div class="mb-5">
                            <div class="text-center mb-4">
                                <a href="#!">
                                    <img
                                        src="{{ asset('images/1-edited-ai-reference.png') }}"
                                        alt="BootstrapBrain Logo"
                                        style="max-height: 50px; height: auto; width: auto;"
                                        class="img-fluid">
                                </a>
                            </div>
                          <h4 class="text-center">Welcome back you've been missed!</h4>
                        </div>


                      </div>
                    </div>


                    <div class="row">
                        <div class="col-12">
                          <div class="d-flex gap-3 flex-column">
                            <a href=" {{ route('auth_google') }}" class="btn btn-lg btn-outline-white">
                              {{-- <span class="ms-2 fs-6">Log in with Google</span> --}}
                              <img src="{{ secure_asset('https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png')}}"  alt="Sign in with Google">
                            </a>
                      </div>
                          <p class="text-center mt-4 mb-5">Or sign in with</p>
                        </div>
                      </div>

                    <form action="{{ route('register.post') }}" method="post" >
                        @csrf
                      <div class="row gy-3 overflow-hidden">
                        <div class="col-12">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" name="name" id="name" placeholder="Full Name" required>
                                <label for="name" class="form-label">Full Name</label>
                                @error('name')
                                <span class="text-danger"> {{$message}}</span>
                                @enderror
                              </div>
                          <div class="form-floating mb-3">
                            <input type="email" class="form-control" name="email" id="email" placeholder="name@example.com" required>
                            <label for="email" class="form-label">Email</label>
                            @error('email')
                            <span class="text-danger"> {{$message}}</span>
                            @enderror
                        </div>
                        </div>
                        <div class="col-12">
                          <div class="form-floating mb-3">
                            <input type="password" class="form-control" name="password" id="password" value="" placeholder="Password" required>
                            <label for="password" class="form-label">Password</label>
                            @error('password')
                            <span class="text-danger"> {{$message}}</span>
                            @enderror
                        </div>
                        </div>

                        <div class="col-12">
                            <div class="form-floating mb-3">
                              <input type="password" class="form-control" name="password_confirmation" id="password" value="" placeholder="Confirm Password" required>
                              <label for="password" class="form-label">Confirm Password</label>

                            </div>
                          </div>

                        {{-- <div class="col-12">
                          <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" name="remember_me" id="remember_me">
                            <label class="form-check-label text-secondary" for="remember_me">
                              Keep me logged in
                            </label>
                          </div>
                        </div> --}}
                        <div class="col-12">
                          <div class="d-grid">
                            <button class="btn btn-dark btn-lg" type="submit">Create an account</button>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div class="row">
                      <div class="col-12">
                        <div class="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center mt-5">
                          {{-- <a href="#!" class="link-secondary text-decoration-none">Create new account</a> --}}
                          {{-- <a href="#!" class="link-secondary text-decoration-none">Forgot password</a> --}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
