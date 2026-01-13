
<?php

namespace App\Http\Controllers;

uphp artisan make:controller MatchingController

# overwrite it with our content
cat > app/Http/Controllers/MatchingController.php <<'PHP'
<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class MatchingController extends Controller
{
    public function index(): View
    {
        $companies = [
            ['id'=>1,'name'=>'Karam Energy','country'=>'Kenya','sector'=>'Energy','summary'=>'Mini-grid installer'],
            ['id'=>2,'name'=>'Saba Foods','country'=>'Ethiopia','sector'=>'Agri','summary'=>'Value-chain aggregator'],
            ['id'=>3,'name'=>'Mebrat Health','country'=>'Eritrea','sector'=>'Health','summary'=>'Diagnostics labs'],
            ['id'=>4,'name'=>'Alem FinTech','country'=>'Ethiopia','sector'=>'FinTech','summary'=>'Agent network'],
        ];

        $matches = [
            ['company'=>$companies[0],'score'=>92.3],
            ['company'=>$companies[1],'score'=>88.9],
            ['company'=>$companies[2],'score'=>84.7],
        ];

        return view('matching.index', compact('companies','matches'));
    }
}
PHP
