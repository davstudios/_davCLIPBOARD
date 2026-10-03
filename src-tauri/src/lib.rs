use serde::{Deserialize,Serialize};
use std::fs;
use tauri::Manager;

#[derive(Clone,Serialize,Deserialize)]
#[serde(rename_all="camelCase")]
struct ClipboardEntry{
    id:String,
    text:String,
    created_at:u64,
    pinned:bool,
}

fn history_path(app:&tauri::AppHandle)->Result<std::path::PathBuf,String>{
    let dir=app.path().app_data_dir().map_err(|error|error.to_string())?;
    fs::create_dir_all(&dir).map_err(|error|error.to_string())?;
    Ok(dir.join("clipboard-history.json"))
}

#[tauri::command]
fn load_clipboard_history(app:tauri::AppHandle)->Result<Vec<ClipboardEntry>,String>{
    let path=history_path(&app)?;
    if !path.exists(){return Ok(Vec::new());}
    let raw=fs::read_to_string(path).map_err(|error|error.to_string())?;
    serde_json::from_str(&raw).map_err(|error|error.to_string())
}

#[tauri::command]
fn save_clipboard_history(app:tauri::AppHandle,entries:Vec<ClipboardEntry>)->Result<(),String>{
    let path=history_path(&app)?;
    let raw=serde_json::to_string_pretty(&entries).map_err(|error|error.to_string())?;
    fs::write(path,raw).map_err(|error|error.to_string())
}

#[cfg_attr(mobile,tauri::mobile_entry_point)]
pub fn run(){
    tauri::Builder::default()
        .setup(|app|{
            #[cfg(target_os="windows")]
            {
                if let Some(window)=app.get_webview_window("main"){window.set_icon(tauri::include_image!("./icons/icon.ico"))?;}
            }
            Ok(())
        })
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_autostart::init(tauri_plugin_autostart::MacosLauncher::LaunchAgent,None))
        .invoke_handler(tauri::generate_handler![load_clipboard_history,save_clipboard_history])
        .run(tauri::generate_context!())
        .expect("error while running _davCLIPBOARD");
}

