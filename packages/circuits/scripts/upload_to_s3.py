import boto3
import os
import argparse
import subprocess
from dotenv import load_dotenv

load_dotenv('circuit.env')

# Set up the client for the AWS S3 service
s3 = boto3.client('s3')  # Ask Aayush for the access key and secret access key

parser = argparse.ArgumentParser(description='Upload the compressed zkey, cpp, and js compilation files to S3 bucket')
parser.add_argument('--bucket_name', type=str, default='zkemail-zkey-chunks', help='Name of the S3 bucket')

default_build_dir = 'build'
build_dir_env = os.getenv('BUILD_DIR')
if build_dir_env is None:
    print("Warning: BUILD_DIR not found in circuit.env, defaulting to '{default_build_dir}'")
    build_dir_env = default_build_dir

parser.add_argument('--build-dir', type=str, default=build_dir_env, help='Name of the build directory directory with the circuitname/ folder')
args = parser.parse_args()
bucket_name = args.bucket_name
build_dir = args.build_dir

# Get the latest commit hash
commit_hash = subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode('utf-8').strip()

# Set the name of the remote directory and the AWS bucket
def upload_to_s3(filename, dir=""):
    if os.path.isfile(os.path.join(dir, filename)):
        with open(os.path.join(dir, filename), 'rb') as file:
            print("Starting upload...")
            s3.upload_fileobj(file, bucket_name, commit_hash + '/' + filename, ExtraArgs={
                              'ACL': 'public-read', 'ContentType': 'binary/octet-stream'})
            print(f"Done uploading {filename} to: https://{bucket_name}.s3.amazonaws.com/{commit_hash}/{filename}")
    elif os.path.isdir(os.path.join(dir, filename)):
        for root, dirs, files in os.walk(os.path.join(dir, filename)):
            for file in files:
                print(root, dir, file)
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, os.path.join(build_dir, circuit_name))
                with open(file_path, 'rb') as file_obj:
                    s3_key = os.path.join(commit_hash, relative_path)
                    print(f"Starting upload of {file_path} to {s3_key}...")
                    s3.upload_fileobj(file_obj, bucket_name, s3_key, ExtraArgs={
                                      'ACL': 'public-read', 'ContentType': 'binary/octet-stream'})
                    print(f"Done uploading {file_path} to: https://{bucket_name}.s3.amazonaws.com/{s3_key}")
    else:
        print(f"Skipping {os.path.join(dir, filename)} as it is not a valid file or directory.")


# Loop through the files in the artifacts directory
dir = os.path.join(build_dir, "artifacts")
print("Uploading for files in: ", dir)
for file in os.listdir(dir):
    upload_to_s3(file, dir)
