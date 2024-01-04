#include <iostream>
using namespace std;

const int SIZE = 5;

void FillArrayrandom(int array[SIZE][SIZE])
{
    for (int i = 0; i < SIZE; i++)
    {
        for (int j = 0; j < SIZE; j++)
        {
            array[i][j] = rand() % 9 + 1;
        }
    }
}

void ShowArray(int array[SIZE][SIZE])
{
    for (int i = 0; i < SIZE; i++)
    {
        for (int j = 0; j < SIZE; j++)
        {
            cout << array[i][j] << " ";
        }
        cout << endl;
    }
}

int main()
{
    int array[SIZE][SIZE];
    FillArrayrandom(array);
    ShowArray(array);

    cout << "Enter sub array size (1 < x < 5) : ";
    int a;
    cin >> a;
    while (a < 2 && a > 5)
    {
        cout << "Enter NORMAL sub array size (1 < x < 5) : ";
        cin >> a;
    }

    int biggest = 0;
    for (int i = 0; i <= SIZE - a; i++)
    {
        for (int j = 0; j <= SIZE - a; j++)
        {
        int cur_sum = 0;
            for (int k = i; k <= i + a; k++)
            {
                for(int m = j; m <= j + a; m++) 
                {
                    cur_sum += array[k][m];
                }
                if(cur_sum>biggest) {
                    biggest = cur_sum;
                    int startR = i;
                    int startT = j;
                }
            }
        }
    }

    cout << "Biggest: " << biggest << endl;

    for (int i = startR; i < startR + a; i++) {
        for (int j = startT; j < startT + a; j++) {
            cout << array[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}