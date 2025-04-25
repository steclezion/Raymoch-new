<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="#" class="brand-link">
        <img src="{{ asset('images/1-edited-ai-reference.png') }}" alt="Raymoch logo" class="brand-image img-circle elevation-3"
             style="opacity: .8">
        <span class="brand-text font-weight-light">Raymoch</span>
    </a>


    <!-- Sidebar -->
    <div class="sidebar">
        <!-- Sidebar user panel (optional) -->
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
                {{-- <img src="{{ asset('dist/img/user2-160x160.jpg') }}" class="img-circle elevation-2" alt="User Image"> --}}
                <span class="brand-text font-weight-light" style="color:white">{{ Auth::user()->name }}</span>
            </div>

        </div>
<span hidden id="user_idd" > {{ Auth::user()->id }} </span>
        <!-- not needed -->
        <!-- SidebarSearch Form-->
        <div class="form-inline">
          <div class="input-group" data-widget="sidebar-search">
            <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search">
            <div class="input-group-append">
              <button class="btn btn-sidebar">
                <i class="fas fa-search fa-fw"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar Menu -->
        <nav class="mt-2">
            {{-- flex-column" data-widget="treeview"  --}}
            <ul class="nav nav-pills nav-sidebar flex-column" role="menu">                <!-- Add icons to the links using the .nav-icon class
                     with font-awesome or any other icon font library -->
                     <li class="nav-item">
            <a href="#" class="nav-link ">
              <i class="nav-icon fas fa-tachometer-alt"></i>
              <p>
                Welcome Page <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-item">
            {{-- @can('application-list') --}}
              <li class="nav-item">
                <a href="{{ url('/home-page-welcomes') }}" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
           <p>First Section </p>
                </a>
              </li>

              <li class="nav-item">
                <a href="{{ url('/home-welcome-second-page') }}" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
           <p>Second Section </p>
                </a>
              </li>

              <li class="nav-item">
                <a href="{{ url('/home-welcome-third-page') }}" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
           <p>Third Section </p>
                </a>
              </li>
            </ul>
        </li>

              <li class="nav-item">
                <a href="#" class="nav-link">
                    <i class="nav-icon fas fa-chart-pie"></i>
                    <p>
                       Descriptions
                        <i class="right fas fa-angle-left"></i>
                    </p>
                </a>
                <ul class="nav nav-item">
                    <li class="nav-item">
                        <a href="{{url('companyinfos')}}" class="nav-link">
                            <i class="far fa-circle nav-icon"></i>
                            <p>Company Information</p>

                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{url('/descriptions')}}" class="nav-link">
                            <i class="far fa-circle nav-icon"></i>
                            <p>Detailed Description</p>

                        </a>
                    </li>

                    <li class="nav-item">
                        <a href="{{url('/company_description_types')}}" class="nav-link">
                            <i class="far fa-circle nav-icon"></i>
                            <p>Description Type</p>

                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="{{url('/company_classifications')}}" class="nav-link">
                            <i class="far fa-circle nav-icon"></i>
                            <p>Business Type</p>

                        </a>
                    </li>


                </ul>
            </li>

               {{-- @endcan --}}


{{--
            @can('application-list')
              <li class="nav-item">
                <a href="{{ route('dossier_sample_status') }}" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Dossier and Sample Status</p>
                </a>
              </li>
              @endcan

              @can('supervisor_roles')
              <li class="nav-item">
                <a href="{{ url('assignment') }}" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Assignment</p>
                </a>
              </li>
              @endcan -->

              @can('assessor-invoice-list')
              <li class="nav-item">
                <a href="{{ route('generate_invoices') }}" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>invoices</p>
                </a>
              </li>
              @endcan
              @can('assessor-receipt-list')
              <li class="nav-item">
                <a href="{{ route('receipts') }}" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Receipts</p>
                </a>
              </li>
              @endcan

                <li class="nav-item">
                <a href="{{ route('check_list.index') }}" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Check Lists</p>
                </a>
              </li>


                <li class="nav-item">
                <a href="{{ route('report_list.index') }}" class="nav-link">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Report</p>
                </a>
              </li>
            </ul>
          </li>

                @can('supervisor_roles')
                    <li class="nav-item">
                        <a href="#" class="nav-link">
                            <i class="nav-icon fas fa-chart-pie"></i>
                            <p>
                                Supervisor
                                <i class="right fas fa-angle-left"></i>
                            </p>
                        </a>
                        <ul class="nav nav-treeview">
                            <li class="nav-item">
                                <a href="{{route('unassigned_index')}}" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Unassigned Dossiers</p>

                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('assigned_index')}}" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Assigned Dossiers </p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('all_index')}}" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>List All Dossiers</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('assessment_report_index')}}" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Ongoing Assessment Reports</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('completed_assessment_report_index')}}" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Completed Assessments</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('document_types.index')}}" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>DeadLine Extension</p>

                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('notification_index')}}" class="nav-link">
                                    <i class="far fa-clock nav-icon"></i>
                                    <p>Notification</p>

                                </a>
                            </li>

                            <li class="nav-item">
                                <a href="{{route('template_index')}}" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Manage Templates</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('document_types.index')}}" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Manage Categories</p>

                                </a>
                            </li>


                            <li class="nav-item">
                                <a href="{{route('all_index')}}" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Upload Guidlines</p>
                                </a>
                            </li>

                            <li class="nav-item">
                                <a href="{{route('users.index')}}" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Users</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('roles.index')}}" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Roles</p>
                                </a>
                            </li>

                        </ul>
                    </li>

                 @endcan


                @can('assessor_roles')

                    <li class="nav-item">
                        <a href="#" class="nav-link">
                            <i class="nav-icon fas fa-chart-pie"></i>
                            <p>
                                Dossier Evaluation
                                <i class="right fas fa-angle-left"></i>
                            </p>
                        </a>
                        <ul class="nav nav-treeview">
                            <li class="nav-item">
                                <a href="{{route('dossier_evaluation_index')}}" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Ongoing Evaluations</p>

                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('completed_dossier_evaluation_index')}}" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Completed Evaluations</p>

                                </a>
                            </li>

                            <li class="nav-item">
                                <a href="pages/charts/flot.html" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Dossier List</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('notification_index')}}" class="nav-link">
                                    <i class="far fa-clock nav-icon"></i>
                                    <p>Notification</p>

                                </a>
                            </li>

                        </ul>
                    </li>

@endcan




                @can('inspection_roles')

                    <li class="nav-item">
                        <a href="#" class="nav-link">
                            <i class="nav-icon fas fa-chart-pie"></i>
                            <p>
                                Inspection Unit
                                <i class="right fas fa-angle-left"></i>
                            </p>
                        </a>
                        <ul class="nav nav-treeview">
                            <li class="nav-item">
                                <a href="{{route('dossier_section_assign_index')}}" class="nav-link">
                                    <i class="far fa-edit nav-icon"></i>
                                    <p>Dossier Sec. Assg.</p>

                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('finished_dossier_section_assign_index')}}" class="nav-link">
                                    <i class="far fa-edit nav-icon"></i>
                                    <p>Evaluated Dossier Assgs.</p>

                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('notification_index')}}" class="nav-link">
                                    <i class="far fa-clock nav-icon"></i>
                                    <p>Notification</p>

                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('inspection_request_index')}}" class="nav-link">
                                    <i class="far fa-clock nav-icon"></i>
                                    <p>Requests</p>

                                </a>
                            </li>

                        </ul>

                    </li>
                @endcan


                @can('qc_roles')
                    <li class="nav-item">
                        <a href="#" class="nav-link">
                            <i class="nav-icon fas fa-chart-pie"></i>
                            <p>
                                Quality Control Unit
                                <i class="right fas fa-angle-left"></i>
                            </p>
                        </a>
                        <ul class="nav nav-treeview">
                            <li class="nav-item">
                                <a href="{{route('dossier_section_assign_index')}}" class="nav-link">
                                    <i class="far fa-circle nav-icon"></i>
                                    <p>Dossier Sec. Assig.</p>

                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('finished_dossier_section_assign_index')}}" class="nav-link">
                                    <i class="far fa-edit nav-icon"></i>
                                    <p>Evaluated Dossier Assgs.</p>

                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('notification_index')}}" class="nav-link">
                                    <i class="far fa-clock nav-icon"></i>
                                    <p>Notification</p>

                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{route('qc_request_index')}}" class="nav-link">
                                    <i class="far fa-clock nav-icon"></i>
                                    <p>Requests</p>

                                </a>
                            </li>


                        </ul>
                    </li>
                @endcan --}}



















                {{--                    @can('application-list')--}}
                {{--                            <li class="nav-item">--}}
                {{--                                <a href="{{ route('application_reception') }}" class="nav-link">--}}
                {{--                                    <i class="far fa-circle nav-icon"></i>--}}
                {{--                                    <p>Application Reception </p>--}}
                {{--                                </a>--}}
                {{--                            </li>--}}
                {{--                        @endcan--}}
                {{--                        @can('application-status-list')--}}
                {{--                            <li class="nav-item">--}}
                {{--                                <a href="{{ route('application_status') }}" class="nav-link">--}}
                {{--                                    <i class="far fa-circle nav-icon"></i>--}}
                {{--                                    <p>Application Status</p>--}}
                {{--                                </a>--}}
                {{--                            </li>--}}
                {{--                        @endcan--}}
                {{--                        @can('assessor-invoice-list')--}}
                {{--                            <li class="nav-item">--}}
                {{--                                <a href="{{ route('generate_invoices') }}" class="nav-link">--}}
                {{--                                    <i class="far fa-circle nav-icon"></i>--}}
                {{--                                    <p>invoices</p>--}}
                {{--                                </a>--}}
                {{--                            </li>--}}
                {{--                        @endcan--}}
                {{--                        @can('assessor-receipt-list')--}}
                {{--                            <li class="nav-item">--}}
                {{--                                <a href="{{ route('receipts') }}" class="nav-link">--}}
                {{--                                    <i class="far fa-circle nav-icon"></i>--}}
                {{--                                    <p>Receipts</p>--}}
                {{--                                </a>--}}
                {{--                            </li>--}}
                {{--                        @endcan--}}

                {{--                        <li class="nav-item">--}}
                {{--                            <a href="{{ route('check_list.index') }}" class="nav-link">--}}
                {{--                                <i class="far fa-circle nav-icon"></i>--}}
                {{--                                <p>Check Lists</p>--}}
                {{--                            </a>--}}
                {{--                        </li>--}}
                {{--                    </ul>--}}
                {{--                </li>--}}


                {{--                <li class="nav-item">--}}
                {{--                    <a href="#" class="nav-link">--}}
                {{--                        <i class="nav-icon fas fa-chart-pie"></i>--}}
                {{--                        <p>--}}
                {{--                            Evaluation Process--}}
                {{--                            <i class="right fas fa-angle-left"></i>--}}
                {{--                        </p>--}}
                {{--                    </a>--}}
                {{--                    <ul class="nav nav-treeview">--}}
                {{--                        <li class="nav-item">--}}
                {{--                            <a href="pages/charts/chartjs.html" class="nav-link">--}}
                {{--                                <i class="far fa-circle nav-icon"></i>--}}
                {{--                                <p>Dossiers Assignment</p>--}}

                {{--                            </a>--}}
                {{--                        </li>--}}
                {{--                        <li class="nav-item">--}}
                {{--                            <a href="pages/charts/flot.html" class="nav-link">--}}
                {{--                                <i class="far fa-circle nav-icon"></i>--}}
                {{--                                <p>Dossier List</p>--}}
                {{--                            </a>--}}
                {{--                        </li>--}}
                {{--                    </ul>--}}

                {{--                    <!--   -->--}}



                {{--                <li class="nav-item ">--}}
                {{--                    <a href="#" class="nav-link">--}}
                {{--                        <i class="nav-icon fas fa-tachometer-alt"></i>--}}
                {{--                        <p>--}}
                {{--                            Evaluation Process--}}
                {{--                            <i class="right fas fa-angle-left"></i>--}}
                {{--                        </p>--}}
                {{--                    </a>--}}
                {{--                    <ul class="nav nav-treeview">--}}

                {{--                        <li class="nav-item menu-is-opening">--}}
                {{--                            <a href="#" class="nav-link">--}}
                {{--                                <i class="nav-icon fas fa-chart-pie"></i>--}}
                {{--                                <p>--}}
                {{--                                    SuperVisor--}}
                {{--                                    <i class="right fas fa-angle-left"></i>--}}
                {{--                                </p>--}}
                {{--                            </a>--}}
                {{--                            <ul class="nav nav-treeview">--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('unassigned_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-circle nav-icon"></i>--}}
                {{--                                        <p>Unassigned Dossiers</p>--}}

                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('assigned_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-circle nav-icon"></i>--}}
                {{--                                        <p>Assigned Dossiers </p>--}}
                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('all_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-circle nav-icon"></i>--}}
                {{--                                        <p>List All Dossiers</p>--}}
                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                                --}}{{--                        <li class="nav-item">--}}
                {{--                                --}}{{--                            <a href="{{route('supervisor_assessor_initial_submition')}}" class="nav-link">--}}
                {{--                                --}}{{--                                <i class="far fa-circle nav-icon"></i>--}}
                {{--                                --}}{{--                                <p>Evaluation Notification</p>--}}
                {{--                                --}}{{--                            </a>--}}
                {{--                                --}}{{--                        </li>--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('document_types.index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-circle nav-icon"></i>--}}
                {{--                                        <p>DeadLine Extension</p>--}}

                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('notification_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-clock nav-icon"></i>--}}
                {{--                                        <p>Notification</p>--}}

                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="pages/charts/uplot.html" class="nav-link">--}}
                {{--                                        <i class="far fa-circle nav-icon"></i>--}}
                {{--                                        <p>Finished Ideas</p>--}}
                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('template_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-circle nav-icon"></i>--}}
                {{--                                        <p>Manage Templates</p>--}}
                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('document_types.index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-circle nav-icon"></i>--}}
                {{--                                        <p>Manage Categories</p>--}}

                {{--                                    </a>--}}
                {{--                                </li>--}}


                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('all_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-circle nav-icon"></i>--}}
                {{--                                        <p>Upload Guidlines</p>--}}
                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                            </ul>--}}
                {{--                        </li>--}}

                {{--                        <li class="nav-item menu-is-opening">--}}
                {{--                            <a href="#" class="nav-link" >--}}
                {{--                                <i class="nav-icon fas fa-chart-pie"></i>--}}
                {{--                                <p>--}}
                {{--                                    Dossier Evaluation--}}
                {{--                                    <i class="right fas fa-angle-left"></i>--}}
                {{--                                </p>--}}
                {{--                            </a>--}}
                {{--                            <ul class="nav nav-treeview">--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('dossier_evaluation_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-circle nav-icon"></i>--}}
                {{--                                        <p>Dossier Evaluation</p>--}}

                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="pages/charts/flot.html" class="nav-link">--}}
                {{--                                        <i class="far fa-circle nav-icon"></i>--}}
                {{--                                        <p>Dossier List</p>--}}
                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('notification_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-clock nav-icon"></i>--}}
                {{--                                        <p>Notification</p>--}}

                {{--                                    </a>--}}
                {{--                                </li>--}}

                {{--                            </ul>--}}
                {{--                        </li>--}}

                {{--                        <li class="nav-item menu-is-opening">--}}
                {{--                            <a href="#" class="nav-link" >--}}
                {{--                                <i class="nav-icon fas fa-chart-pie"></i>--}}
                {{--                                <p>--}}
                {{--                                    Inspection Unit--}}
                {{--                                    <i class="right fas fa-angle-left"></i>--}}
                {{--                                </p>--}}
                {{--                            </a>--}}
                {{--                            <ul class="nav nav-treeview">--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('dossier_section_assign_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-edit nav-icon"></i>--}}
                {{--                                        <p>Dossier Sec. Assg.</p>--}}

                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('notification_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-clock nav-icon"></i>--}}
                {{--                                        <p>Notification</p>--}}

                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('inspection_request_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-clock nav-icon"></i>--}}
                {{--                                        <p>Requests</p>--}}

                {{--                                    </a>--}}
                {{--                                </li>--}}

                {{--                            </ul>--}}

                {{--                        </li>--}}

                {{--                        <li class="nav-item menu-is-opening">--}}
                {{--                            <a href="#" class="nav-link">--}}
                {{--                                <i class="nav-icon fas fa-chart-pie"></i>--}}
                {{--                                <p>--}}
                {{--                                    Quality Control Unit--}}
                {{--                                    <i class="right fas fa-angle-left"></i>--}}
                {{--                                </p>--}}
                {{--                            </a>--}}
                {{--                            <ul class="nav nav-treeview">--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('dossier_section_assign_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-circle nav-icon"></i>--}}
                {{--                                        <p>Dossier Sec. Assig.</p>--}}

                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('notification_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-clock nav-icon"></i>--}}
                {{--                                        <p>Notification</p>--}}

                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('qc_request_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-clock nav-icon"></i>--}}
                {{--                                        <p>Requests</p>--}}

                {{--                                    </a>--}}
                {{--                                </li>--}}


                {{--                            </ul>--}}
                {{--                        </li>--}}

                {{--                        <li class="nav-item menu-is-opening">--}}
                {{--                            <a href="#" class="nav-link">--}}
                {{--                                <i class="nav-icon fas fa-chart-pie"></i>--}}
                {{--                                <p>--}}
                {{--                                    PV Unit--}}
                {{--                                    <i class="right fas fa-angle-left"></i>--}}
                {{--                                </p>--}}
                {{--                            </a>--}}
                {{--                            <ul class="nav nav-treeview">--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('dossier_evaluation_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-circle nav-icon"></i>--}}
                {{--                                        <p>Dossier Section Assignments</p>--}}

                {{--                                    </a>--}}
                {{--                                </li>--}}
                {{--                                <li class="nav-item">--}}
                {{--                                    <a href="{{route('dossier_evaluation_index')}}" class="nav-link">--}}
                {{--                                        <i class="far fa-circle nav-icon"></i>--}}
                {{--                                        <p>Notification</p>--}}

                {{--                                    </a>--}}
                {{--                                </li>--}}

                {{--                            </ul>--}}
                {{--                        </li>--}}

                {{--                        <li class="nav-item">--}}
                {{--                            <a href="{{route('users.index')}}" class="nav-link">--}}
                {{--                                <i class="far fa-circle nav-icon"></i>--}}
                {{--                                <p>Users</p>--}}
                {{--                            </a>--}}
                {{--                        </li>--}}
                {{--                        <li class="nav-item">--}}
                {{--                            <a href="{{route('roles.index')}}" class="nav-link">--}}
                {{--                                <i class="far fa-circle nav-icon"></i>--}}
                {{--                                <p>Roles</p>--}}
                {{--                            </a>--}}
                {{--                        </li>--}}


                {{--                    </ul>--}}
                {{--                </li>--}}

            </ul>
        </nav>
        <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
</aside>
