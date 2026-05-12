class BankAccount:
    def __init__(self, acc_num, name, pin, balance=0):
        self.acc_num = acc_num
        self.name = name
        self.pin = pin
        self.balance = balance
        self.transactions = []
    
    def add_transaction(self, transaction):
        self.transactions.append(transaction)

class Bank:
    def __init__(self):
        self.accounts = {}
        self.next_acc_num = 1001
    
    def create_account(self):
        print("\n=== CREATE NEW ACCOUNT ===")
        name = input("Enter your name: ").strip()
        if not name:
            print("Name cannot be empty!")
            return
        
        pin = input("Set a 4-digit PIN: ").strip()
        if len(pin) != 4 or not pin.isdigit():
            print("PIN must be exactly 4 digits!")
            return
        
        initial_deposit = input("Enter initial deposit (minimum ₹100): ₹").strip()
        try:
            initial_deposit = float(initial_deposit)
            if initial_deposit < 100:
                print("Minimum initial deposit is ₹100!")
                return
        except ValueError:
            print("Invalid amount!")
            return
        
        acc_num = self.next_acc_num
        self.next_acc_num += 1
        
        acc = BankAccount(acc_num, name, pin, initial_deposit)
        self.accounts[acc_num] = acc
        acc.add_transaction(f"Initial deposit: ₹{initial_deposit:.2f}")
        
        print(f"\n✓ Account created successfully!")
        print(f"Account Number: {acc_num}")
        print(f"Account Holder: {name}")
        print(f"Initial Balance: ₹{initial_deposit:.2f}")
    
    def login(self):
        try:
            acc_num = int(input("\nEnter account number: ").strip())
        except ValueError:
            print("Invalid account number!")
            return None
        
        if acc_num not in self.accounts:
            print("Account not found!")
            return None
        
        pin = input("Enter PIN: ").strip()
        if self.accounts[acc_num].pin != pin:
            print("Incorrect PIN!")
            return None
        
        return self.accounts[acc_num]
    
    def check_balance(self, acc):
        print(f"\n=== BALANCE INQUIRY ===")
        print(f"Account Number: {acc.acc_num}")
        print(f"Account Holder: {acc.name}")
        print(f"Current Balance: ₹{acc.balance:.2f}")
    
    def deposit(self, acc):
        print("\n=== DEPOSIT ===")
        amount_str = input("Enter deposit amount: ₹").strip()
        try:
            amount = float(amount_str)
            if amount <= 0:
                print("Amount must be positive!")
                return
            
            acc.balance += amount
            acc.add_transaction(f"Deposit: +₹{amount:.2f}")
            print(f"\n✓ Deposit successful!")
            print(f"Deposited: ₹{amount:.2f}")
            print(f"New Balance: ₹{acc.balance:.2f}")
        except ValueError:
            print("Invalid amount!")
    
    def withdraw(self, acc):
        print("\n=== WITHDRAWAL ===")
        amount_str = input("Enter withdrawal amount: ₹").strip()
        try:
            amount = float(amount_str)
            if amount <= 0:
                print("Amount must be positive!")
                return
            
            if amount > acc.balance:
                print(f"Insufficient funds! Current balance: ₹{acc.balance:.2f}")
                return
            
            acc.balance -= amount
            acc.add_transaction(f"Withdrawal: -₹{amount:.2f}")
            print(f"\n✓ Withdrawal successful!")
            print(f"Withdrawn: ₹{amount:.2f}")
            print(f"New Balance: ₹{acc.balance:.2f}")
        except ValueError:
            print("Invalid amount!")
    
    def view_transactions(self, acc):
        print("\n=== TRANSACTION HISTORY ===")
        print(f"Account: {acc.acc_num} - {acc.name}")
        if not acc.transactions:
            print("No transactions yet.")
        else:
            for i, trans in enumerate(acc.transactions, 1):
                print(f"{i}. {trans}")
        print(f"\nCurrent Balance: ₹{acc.balance:.2f}")

def main():
    bank = Bank()
    
    while True:
        print("\n" + "="*40)
        print("   WELCOME TO TERMINAL BANK")
        print("="*40)
        print("1. Create New Account")
        print("2. Login to Existing Account")
        print("3. Exit")
        print("="*40)
        
        choice = input("Select an option (1-3): ").strip()
        
        if choice == '1':
            bank.create_account()
        
        elif choice == '2':
            acc = bank.login()
            if acc:
                print(f"\n✓ Login successful! Welcome, {acc.name}!")
                
                while True:
                    print("\n" + "-"*40)
                    print("   ACCOUNT MENU")
                    print("-"*40)
                    print("1. Check Balance")
                    print("2. Deposit")
                    print("3. Withdraw")
                    print("4. Transaction History")
                    print("5. Logout")
                    print("-"*40)
                    
                    acc_choice = input("Select an option (1-5): ").strip()
                    
                    if acc_choice == '1':
                        bank.check_balance(acc)
                    elif acc_choice == '2':
                        bank.deposit(acc)
                    elif acc_choice == '3':
                        bank.withdraw(acc)
                    elif acc_choice == '4':
                        bank.view_transactions(acc)
                    elif acc_choice == '5':
                        print("\n✓ Logged out successfully!")
                        break
                    else:
                        print("Invalid option! Please try again.")
        
        elif choice == '3':
            print("\nThank you for using Terminal Bank!")
            print("Goodbye! 👋")
            break
        
        else:
            print("Invalid option! Please try again.")

if __name__ == "__main__":
    main()