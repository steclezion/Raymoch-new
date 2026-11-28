<?php

// Runtime answer policy for Company Insight's local retrieval engine.
return [
    'starters' => [
        'Summarize the company profile.',
        'Who owns the company?',
        'Show the latest financial results.',
        'Who is on the leadership team?',
        'Which markets does the company operate in?',
        'What is the company’s verification status?',
    ],
    'corrections' => [
        'finacials' => 'financials',
        'fincancials' => 'financials',
        'revnue' => 'revenue',
        'verfication' => 'verification',
        'verifcation' => 'verification',
        'capabilites' => 'capabilities',
        'headquaters' => 'headquarters',
        'documments' => 'documents',
    ],
    'topics' => [
        'F' => '/\b(financ\w*|fiscal|revenue|ebitda|income|profit\w*|loss\w*|valuation|assets|liabilit\w*|currency|performance|results)\b/i',
        'T' => '/\b(team|leader\w*|staff|management|founder\w*|executive\w*|ceo|people)\b/i',
        'D' => '/\b(document\w*|filing\w*|files?|deck\w*)\b/i',
        'L' => '/\b(location\w*|address|based|city|where|headquarters)\b/i',
        'P' => '/\b(profile|summary|overview|company details?|about (?:the |this )?(?:company|business)|sector|industry|stage|verified|founded|mission|vision|business model|legal structure)\b/i',
        'W' => '/\b(owns?|owned|owners?|ownership|shareholders?|shareholdings?|equity stakes?|parent (?:company|organization)|subsidiar(?:y|ies))\b/i',
        'O' => '/\b(product\w*|service\w*|offerings?|catalog\w*|sell|manufactur\w*)\b/i',
        'C' => '/\b(capabilit\w*|capacity|expertise|certif\w*|export\w*)\b/i',
        'M' => '/\b(market\w*|countries|operat\w*|expansion|destinations?)\b/i',
        'V' => '/\b(verified|verification|cti|credential\w*)\b/i',
        'G' => '/\b(gallery|images?|photo\w*)\b/i',
        'B' => '/\b(contact\w*|website|reach)\b/i',
        'R' => '/\b(procurement|tender\w*|rfp|bids?)\b/i',
        'I' => '/\b(invest\w*|funding|capital raise|opportunit\w*)\b/i',
    ],
    'no_match' => 'No relevant company records matched this question. Ask about the company profile, financials, leadership, products, markets, or verification.',
    'out_of_scope' => 'Company Insight can explain records for the selected company. It cannot provide investment recommendations, request credentials, or disclose private records.',
    'restricted_question' => '/\b(should i invest|investment advice|recommend (?:an? )?invest(?:ment|ing)|passwords?|api keys?|private messages|audit logs|national id|passport number|bank account)\b/i',
    'market_limit' => 'Operating and target markets show where the company operates or plans to operate. These records do not establish market size, trends, or competitors.',
];
