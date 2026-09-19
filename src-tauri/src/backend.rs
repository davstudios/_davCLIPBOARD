use crate::core::{result, ActionOptions, ActionResult};
use arboard::Clipboard;

#[tauri::command]
pub fn run_action(action:String,_paths:Vec<String>,options:ActionOptions)->ActionResult{match action.as_str(){"read_clipboard"=>match Clipboard::new().and_then(|mut c|c.get_text()){Ok(text)=>result(true,"Clipboard captured","Text read from the system clipboard",text),Err(e)=>result(false,"Clipboard unavailable","Unable to read text clipboard",e.to_string())},"write_clipboard"=>{let Some(text)=options.text else{return result(false,"Text required","Choose a history item",String::new());};match Clipboard::new().and_then(|mut c|c.set_text(text.clone())){Ok(_)=>result(true,"Copied","Text restored to the clipboard",text),Err(e)=>result(false,"Copy failed","Unable to write the clipboard",e.to_string())}},_=>result(false,"Preview feature","This clipboard workflow is managed in the interface or planned for a later release",action)}}
