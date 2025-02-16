#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Listener, Manager};
use tauri_nspanel::ManagerExt;
use tauri_plugin_global_shortcut::{Code, Modifiers, Shortcut, ShortcutState};
use window::WebviewWindowExt;

mod command;
mod config; // Import your config module (config.rs)
mod window;

pub const SPOTLIGHT_LABEL: &str = "main";

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![command::show, command::hide])
        .plugin(tauri_nspanel::init())
        .plugin(tauri_plugin_shell::init())
        .setup(move |app| {
            // Call the function from config.rs to create the folder and file
            config::create_folder_and_file().expect("Failed to create config folder and file");

            // Set activation policy to Accessory so the app icon doesn't show in the dock
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            let handle = app.app_handle();
            let window = handle.get_webview_window(SPOTLIGHT_LABEL).unwrap();

            // Convert the window to a spotlight panel
            let panel = window.to_spotlight_panel()?;

            handle.listen(
                format!("{}_panel_did_resign_key", SPOTLIGHT_LABEL),
                move |_| {
                    // Hide the panel when it's no longer the key window
                    panel.order_out(None);
                },
            );

            Ok(())
        })
        // Register a global shortcut (⌘+Shift+Enter) to toggle the spotlight panel
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_shortcut(Shortcut::new(
                    Some(Modifiers::SUPER | Modifiers::SHIFT),
                    Code::Enter,
                ))
                .unwrap()
                .with_handler(|app, shortcut, event| {
                    if event.state == ShortcutState::Pressed
                        && shortcut.matches(Modifiers::SUPER | Modifiers::SHIFT, Code::Enter)
                    {
                        let window = app.get_webview_window(SPOTLIGHT_LABEL).unwrap();
                        let panel = app.get_webview_panel(SPOTLIGHT_LABEL).unwrap();

                        if panel.is_visible() {
                            panel.order_out(None);
                        } else {
                            window.center_at_cursor_monitor().unwrap();
                            panel.show();
                        }
                    }
                })
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
