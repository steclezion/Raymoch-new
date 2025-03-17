import { Link } from "@inertiajs/react";

export default function Pagination({ links }) { // ✅ Fix prop name (camelCase)
    return (
        <nav className="text-center mt-4">
            {links.map((link, index) => (
                <Link
                preserveScroll
                    key={index} // ✅ Add unique key
                    href={link.url || "#"} // ✅ Ensure valid URL (prevent null error)
                    className={
"inline-block py-2 px-3 rounded-lg text-gray-200 text-xs" +
(link.active ? "bg-gray-950 " :  "") +
(!link.url ? "text-gray-500 cursor-not-allowed" : "hover:bg-gray-950")
                    }
    dangerouslySetInnerHTML = {{__html: link.label }}

                ></Link>
            ))}
        </nav>
    );
}

/*

{

import { Link } from "@inertiajs/react";

export default function Pagination({ links }) { // ✅ Fix prop name (camelCase)
    return (
        <nav className="text-center mt-4">
            {links.map((link, index) => (
                <Link
                    key={index} // ✅ Add unique key
                    href={link.url || "#"} // ✅ Ensure valid URL (prevent null error)
                    className={`px-3 py-1 border ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                    dangerouslySetInnerHTML={{ __html: link.label }} // ✅ Still allows HTML labels
                ></Link>
            ))}
        </nav>
    );
}


  "data": [
    { "id": 1, "name": "Project A" },
    { "id": 2, "name": "Project B" },
    { "id": 3, "name": "Project C" },
    { "id": 4, "name": "Project D" },
    { "id": 5, "name": "Project E" }
  ],
  "links": [
    { "url": null, "label": "&laquo; Previous", "active": false },
    { "url": "http://example.com/projects?page=1", "label": "1", "active": true },
    { "url": "http://example.com/projects?page=2", "label": "2", "active": false },
    { "url": "http://example.com/projects?page=3", "label": "3", "active": false },
    { "url": "http://example.com/projects?page=4", "label": "4", "active": false },
    { "url": "http://example.com/projects?page=2", "label": "Next &raquo;", "active": false }
  ],
  "current_page": 1,
  "last_page": 4,
  "per_page": 5,
  "total": 20
}
*/
