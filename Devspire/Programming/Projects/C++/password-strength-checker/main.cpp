#include <iostream>
#include <string>
#include <vector>
#include <cctype> //standard library header that provides functions for character classification and manipulation.
using namespace std;

// ANSI color codes
namespace Color
{
    const string RESET = "\033[0m";
    const string RED = "\033[31m";
    const string GREEN = "\033[32m";
    const string YELLOW = "\033[33m";
    const string CYAN = "\033[36m";
    const string BLUE = "\033[34m";
}

// Function to Calculate Password Strength
int checkStrength(const string &password, bool rules[])
{
    int score = 0;

    // Rule 1: Minumum Length
    if (password.length() >= 8)
    {
        rules[0] = true;
        score++;
    }

    // Rule 2 : Uppercase Letter
    for (char c : password)
    {
        if (isupper(c))
        {
            rules[1] = true;
            score++;
            break;
        }
    }

    // Rule 3 : Lowercase Letter
    for (char c : password)
    {
        if (islower(c))
        {
            rules[2] = true;
            score++;
            break;
        }
    }

    // Rule 4 : Digit
    for (char c : password)
    {
        if (isdigit(c))
        {
            rules[3] = true;
            score++;
            break;
        }
    }

    // Rule 5: Special Character
    string special = "!@#$%^&*()-_=+{}[]|;:'\",.<>/?`~";
    for (char c : password)
    {
        if (special.find(c) != string::npos)
        {
            rules[4] = true;
            score++;
            break;
        }
    }

    return score;
}

// Convert score -> Strength Message
string getStrengthMessage(int score)
{
    switch (score)
    {
    case 0:
    case 1:
        return Color::RED + "Very Weak" + Color::RESET;
    case 2:
        return Color::YELLOW + "Medium" + Color::RESET;
    case 3:
        return Color::CYAN + "Strong" + Color::RESET;
    case 4:
    case 5:
        return Color::GREEN + "Very Strong" + Color::RESET;
    }

    return "Unknown";
}

int main()
{
    int n;
    cout << "Enter number of passwords to check: ";
    cin >> n;
    cin.ignore(); // To ignore the newline character after integer input

    vector<string> passwords(n);
    cout << "Enter passwords (each on a new line):" << endl;

    for (int i = 0; i < n; i++)
    {
        getline(cin, passwords[i]);
    }

    // Strength Counters
    int countStrength[5] = {0};
    cout << Color::BLUE + "\n=== Batch Password Strength Report ===" + Color::RESET << endl;

    for (int i = 0; i < n; i++)
    {
        bool rules[5] = {false};
        int score = checkStrength(passwords[i], rules);
        string strength = getStrengthMessage(score);

        // Count Strength Type
        if (score == 0)
            countStrength[0]++;
        else if (score == 1)
            countStrength[1]++;
        else if (score == 2)
            countStrength[2]++;
        else if (score == 3)
            countStrength[3]++;
        else if (score >= 4)
            countStrength[4]++;

        cout << "\nPassword #" << i + 1 << ": " << Color::YELLOW + passwords[i] + Color::RESET << endl;
        cout << "----------------------------------------" << endl;
        cout << "Length greater than or equal to 8: " << (rules[0] ? "OK" : "FAIL") << endl;
        cout << "Contains Uppercase Letter        : " << (rules[1] ? "OK" : "FAIL") << endl;
        cout << "Contains Lowercase Letter        : " << (rules[2] ? "OK" : "FAIL") << endl;
        cout << "Contains Digit                   : " << (rules[3] ? "OK" : "FAIL") << endl;
        cout << "Contains Special Character       : " << (rules[4] ? "OK" : "FAIL") << endl;

        cout << "Strength: " << strength << endl;
        cout << "----------------------------------------" << endl;
    }

    // Summary Report
    cout << Color::BLUE + "\n=== Summary Report ===" + Color::RESET << endl;
    cout << "Very weak  : " << countStrength[0] << endl;
    cout << "Weak       : " << countStrength[1] << endl;
    cout << "Medium     : " << countStrength[2] << endl;
    cout << "Strong     : " << countStrength[3] << endl;
    cout << "Very Strong: " << countStrength[4] << endl;

    return 0;
}