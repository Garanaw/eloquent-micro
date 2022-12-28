function strncmp(str1: string, str2: string, n: number) {
    str1 = str1.substring(0, n);
    str2 = str2.substring(0, n);

    if (str1 === str2) {
        return 0;
    }

    return str1 > str2 ? 1 : -1;
}

export { strncmp };
