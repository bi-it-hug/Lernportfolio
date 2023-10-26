import subprocess

for command in ['git add *', f'git commit -m {input("Commit message: ")}', 'git push']:
    subprocess.run(command, shell=True)