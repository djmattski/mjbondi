<?php


function matt_preprocess_html(&$variables){
	
	$meta_ie_render_engine = array(
		'#type' => 'html_tag',
		'#tag' => 'meta',
		'#attributes' => array(
		  'content' =>  'IE=edge,chrome=1',
		  'http-equiv' => 'X-UA-Compatible',
		)
	);
	
	// Add header meta tag for IE to head
	drupal_add_html_head($meta_ie_render_engine, 'meta_ie_render_engine');


	//Set up keywords and Descript
	$keywords = 'Photography, Nikon, Travel photography';
	$desc = "Photography for me, like so many others, is a perspective. A way of seeing the world that is different for all of us. Different in its' colours, its' shadows, its' lines, its' depth and in its' truth.";

	if(array_key_exists('nodes',$variables['page']['content']['system_main'])){
		//print $variables['page']['content']['system_main']['nodes'];
		$arrayKeys = array_keys($variables['page']['content']['system_main']['nodes']);
		$nid = $arrayKeys[0];

		//Add description with the page
		$sql = "SELECT n.title, fmk.field_meta_key_value, fmd.field_meta_descript_value ".
				"FROM {node} AS n ".
				"LEFT JOIN {field_data_field_meta_key} AS fmk ON(fmk.entity_id = n.nid) ".
				"LEFT JOIN {field_data_field_meta_descript} AS fmd ON(fmd.entity_id = n.nid) ".
				"WHERE n.nid = :nid";

		$result = db_query($sql,array(':nid'=>$nid));
		$number_of_rows = $result->rowCount(); //Count the results.
		if($number_of_rows > 0){
			foreach ($result as $record) {
				if ($record->field_meta_key_value != '') {
					$keywords .= ', '.$record->field_meta_key_value;
				}
				if ($record->field_meta_descript_value != '') {
					$desc = $record->field_meta_descript_value;
				}
			}
		}
	}


	//Set up meta tags
	$meta_key_words = array(
		'#type' => 'html_tag',
		'#tag' => 'meta',
		'#attributes' => array(
			'name' => 'keywords',
			'content' =>  $keywords,
		)
	);
	drupal_add_html_head($meta_key_words, 'meta_key_words');
	//
	$meta_key_description = array(
		'#type' => 'html_tag',
		'#tag' => 'meta',
		'#attributes' => array(
			'name' => 'description',
			'content' =>  $desc,
		)
	);
	drupal_add_html_head($meta_key_description, 'meta_key_description');

	//Add in image rel
	global $base_url;
	$variables['img_rel'] = '';
	if (arg(0) != 'node'){
        $node = NULL;
    }else{
        $node = menu_get_object();
    }
    if ($node->nid == 49) {//india
    	$variables['img_rel'] = '<link rel="image_src" href="'.$base_url.'/sites/default/files/portfolio/india/DSC_5817.jpg" / ><!--formatted-->';
    }
	
	
}

/**
* Encode an email address to display
* @param $email (String) : The email to encode
* @return String
*/
function encode_email_address($email){
	$output = '';
	for ($i = 0; $i < strlen($email); $i++) {
		$output .= '&#'.ord($email[$i]).';';
	}
	return $output;
}