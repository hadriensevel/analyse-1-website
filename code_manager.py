import os
import subprocess
import shutil

BASE_PATH = os.getcwd()

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

def clear_all_contents(directory):
    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        if os.path.isdir(item_path):
            shutil.rmtree(item_path)
        else:
            os.remove(item_path)

def copy_files(src, dest, clear_subfolders=False):
    if clear_subfolders:
        clear_all_contents(dest)
    else:
        clear_only_files(dest)

    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dest, item)
        if not os.path.isdir(s):
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
        print("\nChoose an action:")
        print("[U] Update (Pull and then Copy)")
        print("[P] Pull Latest Changes")
        print("[C] Copy Files")
        print("[S] Push Changes")
        print("[Q] Quit")

        choice = input("Your choice: ").lower()

        if choice == 'u':
            if pull_latest_changes():
                run_npm_commands()
                copy_files(os.path.join(BASE_PATH, "dist", "js"), "../../../../web/js")
                copy_files(os.path.join(BASE_PATH, "dist", "css"), "../../../../web/css", clear_subfolders=True)
            print("Done!")
        elif choice == 'p':
            pull_latest_changes()
            print("Done!")
        elif choice == 'c':
            run_npm_commands()
            copy_files(os.path.join(BASE_PATH, "dist", "js"), "../../../../web/js")
            copy_files(os.path.join(BASE_PATH, "dist", "css"), "../../../../web/css", clear_subfolders=True)
            print("Done!")
        elif choice == 's':
            push_changes()
            print("Done!")
        elif choice == 'q':
            break
        else:
            print("Invalid choice!")

if __name__ == "__main__":
    main()
