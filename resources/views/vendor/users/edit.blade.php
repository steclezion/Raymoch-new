@extends('layouts_admin.app')


@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="row">

                <div class="col-12">
                    @if (count($errors) > 0)

                        <div class="alert alert-danger">

                            <strong>Whoops!</strong> There were some problems with your input.<br><br>

                            <ul>

                                @foreach ($errors->all() as $error)

                                    <li>{{ $error }}</li>

                                @endforeach

                            </ul>

                        </div>

                    @endif
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title"><h2>Edit New User</h2></h3>


                            <div class="card-tools">

                                <a class="btn btn-primary" href="{{ route('users.index') }}"> Back</a>

                            </div>

                        </div>


                        {!! Form::model($user, ['method' => 'PATCH','route' => ['users.update', $user->id]]) !!}

                        <div class="card-body">


                            <strong>Name:</strong>

                            {!! Form::text('first_name',null , array('placeholder' => 'Name','class' => 'form-control')) !!}


                            <div class="form-group">

                                <strong>Email:</strong>

                                {!! Form::text('email', null, array('placeholder' => 'Email','class' => 'form-control')) !!}

                            </div>


                            <div class="form-group">

                                <strong>Password:</strong>

                                {!! Form::password('password', array('placeholder' => 'Password','class' => 'form-control')) !!}

                            </div>


                            <div class="form-group">

                                <strong>Confirm Password:</strong>

                                {!! Form::password('confirm-password', array('placeholder' => 'Confirm Password','class' => 'form-control')) !!}

                            </div>


                            <div class="form-group">

                                <strong>Role:</strong>

                                {!! Form::select('roles[]', $roles,$userRole, array('class' => 'form-control','multiple')) !!}

                            </div>


                            <div class="card-footer">

                                <button type="submit" class="btn btn-success">Submit</button>

                            </div>


                        </div>
                        {!! Form::close() !!}
                    </div>
                </div>
            </div>
        </div>
    </section>


@endsection
