import random
import string

def get_random_password():
    random_source = string.ascii_letters + string.digits + "[!@#$%&*s]"
    # select 1 lowercase
    password = random.choice(string.ascii_lowercase)
    # select 1 uppercase
    password += random.choice(string.ascii_uppercase)
    # select 1 digit
    password += random.choice(string.digits)
    # select 1 special symbol
    password += random.choice("[!@#$%&*s]")

    # generate other characters
    for i in range(8):
        password += random.choice(random_source)

    password_list = list(password)
    # shuffle all characters
    random.SystemRandom().shuffle(password_list)
    password = ''.join(password_list)
    return password