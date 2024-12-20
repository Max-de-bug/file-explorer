use std::fs;
use tauri::command;
use dirs_next::home_dir;
use sysinfo::Disks;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

// List all disks on the system
#[tauri::command]
fn list_disks() -> Vec<String> {
    let disks = Disks::new_with_refreshed_list();
    let mut disk_info = Vec::new();
    for disk in disks.list() {
        disk_info.push(format!(
            "{:?}: {:?}, Total Space: {}", disk.name(), disk.kind(), disk.total_space()));
    }
    disk_info
}

// List files in the user's Downloads folder
#[command]
fn list_downloads() -> Result<Vec<String>, String> {
    // Get the user's home directory
    let home_dir = home_dir().ok_or_else(|| "Could not determine home directory".to_string())?;

    // Construct the Downloads folder path
    let downloads_dir = home_dir.join("Downloads");

    // Check if the Downloads folder exists and is a directory
    if !downloads_dir.exists() {
        return Err(format!("Downloads folder not found: {:?}", downloads_dir));
    }
    if !downloads_dir.is_dir() {
        return Err(format!("Path is not a directory: {:?}", downloads_dir));
    }

    // Read the contents of the Downloads directory
    let entries = fs::read_dir(downloads_dir).map_err(|e| {
        format!("Failed to read the Downloads folder: {:?}", e)
    })?;

    let mut file_names = Vec::new();

    // Iterate over the directory entries and collect file names
    for entry in entries {
        if let Ok(entry) = entry {
            let file_name = entry.file_name().to_string_lossy().into_owned();
            file_names.push(file_name);
        }
    }

    Ok(file_names)
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![list_disks, list_downloads]) // Add list_downloads here
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
