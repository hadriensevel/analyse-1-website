import os
import subprocess
import shutil

BASE_PATH = os.getcwd()
WEB_PATH = "../../web"

class TerminalColor:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

successMessage = "\U00002705 " + TerminalColor.OKGREEN + "Done!" + TerminalColor.ENDC

def pull_latest_changes():
    try:
        result = subprocess.run(["git", "pull"], check=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if "CONFLICT" in result.stdout:
            print("Merge conflict detected! Please resolve conflicts manually.")
            return False
    except subprocess.CalledProcessError:
        print("Error: There was a problem pulling the latest changes.")
        return False
    return True

def run_npm_commands():
    subprocess.run(["npm", "install"], check=True)
    subprocess.run(["npm", "run", "build"], check=True)

def clear_only_files(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        if os.path.isfile(item_path):
            os.remove(item_path)

def clear_all_contents(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        if os.path.isdir(item_path):
            shutil.rmtree(item_path)
        else:
            os.remove(item_path)

def copy_files_and_folders(src, dest, clear_subfolders=False):
    if not os.path.exists(src):
        print(f"Warning: Source directory {src} does not exist.")
        return
    
    if clear_subfolders:
        clear_all_contents(dest)
    else:
        clear_only_files(dest)

    if not os.path.exists(dest):
        os.makedirs(dest)

    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dest, item)
        if os.path.isdir(s):
            copy_files_and_folders(s, d)
        else:
            shutil.copy2(s, d)

def push_changes():
    try:
        message = input("Enter your commit message: ")
        subprocess.run(["git", "add", "."], check=True)
        subprocess.run(["git", "commit", "-m", message], check=True)
        subprocess.run(["git", "push"], check=True)
    except subprocess.CalledProcessError:
        print("Error: There was a problem pushing changes. Check your git settings or connectivity.")

def main():
    while True:
        print(TerminalColor.HEADER + "\nChoose an action:" + TerminalColor.ENDC)
        print("[U] Update (Pull and then Copy)")
        print("[P] Pull Latest Changes")
        print("[C] Copy Files")
        print("[S] Push Changes")
        print("[Q] Quit")

        choice = input().lower()

        if choice == 'u':
            if pull_latest_changes():
                run_npm_commands()
                copy_files_and_folders(os.path.join(BASE_PATH, "dist", "js"), os.path.join(WEB_PATH, "js"))
                copy_files_and_folders(os.path.join(BASE_PATH, "dist", "css"), os.path.join(WEB_PATH, "css"), clear_subfolders=True)
            print(successMessage)
            break
        elif choice == 'p':
            pull_latest_changes()
            print(successMessage)
            break
        elif choice == 'c':
            run_npm_commands()
            copy_files_and_folders(os.path.join(BASE_PATH, "dist", "js"), os.path.join(WEB_PATH, "js"))
            copy_files_and_folders(os.path.join(BASE_PATH, "dist", "css"), os.path.join(WEB_PATH, "css"), clear_subfolders=True)
            print(successMessage)
            break
        elif choice == 's':
            push_changes()
            print(successMessage)
            break
        elif choice == 'q':
            break
        else:
            print(TerminalColor.FAIL + "Invalid choice!" + TerminalColor.ENDC)

if __name__ == "__main__":
    main()
