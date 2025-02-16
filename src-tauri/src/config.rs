use std::fs;
use std::io;
use std::path::Path;

pub fn create_folder_and_file() -> io::Result<()> {
    // Get the home directory.
    let home_dir = std::env::var("HOME").expect("Failed to get home directory");

    // Define the folder and file names.
    let folder_name = "com.commit.98";
    let file_name = "dir.conf";

    // Build the full path to the Application Support folder.
    let app_support_path = format!("{}/Library/Application Support", home_dir);
    let folder_path = Path::new(&app_support_path).join(folder_name);

    // Create the folder if it doesn't exist.
    if !folder_path.exists() {
        fs::create_dir_all(&folder_path)?;
    }

    // Build the full file path.
    let file_path = folder_path.join(file_name);

    // Create the file if it doesn't exist.
    if !file_path.exists() {
        fs::File::create(&file_path)?;
    }

    Ok(())
}
