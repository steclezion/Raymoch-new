<div class="col-12">
    <table class="table">
        <thead>
        <th>Evaluation Processes</th>
        <th>Completed ?</th>
        {{--<th>Date</th>--}}
        </thead>
        <tbody>

        <tr>
            @if($dossier_evaluation_details->application_type==1)
                <td>QOS/QIS Assessment Completed</td>
                <td>

                    @if($evaluation_document_progress->QOS_is_done==1)
                        <input id="qos_status" name="qos_status" type="checkbox" checked disabled/>
                    @else
                        <input id="qos_status" name="qos_status" type="checkbox" onclick="update_QOS_status(this)"
                               value="{{ $evaluation_document_progress->id}}" />
                    @endif
                </td>
                <td></td>
        </tr>
        @endif
        <tr>
            <td>1st Query Issued</td>
            <td>@if($evaluation_document_progress->issue_query_is_done==1)
                    <input type="checkbox" checked disabled/>
                @else
                    <input type="checkbox" disabled/>
                @endif</td>
            <td></td>
        </tr>

        @if($dossier_evaluation_details->application_type==1)
            <tr>
                <td>QC Sample test Received (Uploaded)</td>
                <td>@if($evaluation_document_progress->qc_sample_is_done==1)
                        <input type="checkbox" checked disabled/>
                    @else
                        <input type="checkbox" disabled/>
                    @endif</td>
                <td></td>
            </tr>
        @endif
        <tr>
            <td>Assessment Report Uploaded</td>
            <td>@if($evaluation_document_progress->assessment_submitted==2)
                    <input type="checkbox" checked disabled/>
                @else
                    <input type="checkbox" disabled/>
                @endif</td>
            <td></td>
        </tr>
        <tr>
            <td>Dossier Assessment Completed</td>
            <td>@if($evaluation_document_progress->assessment_submitted_to_supervisor==1)
                    <input type="checkbox" checked disabled/>
                @else
                    <input type="checkbox" disabled/>
                @endif</td>
            <td></td>
        </tr>
        </tbody>
    </table>

</div>