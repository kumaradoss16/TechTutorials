# web_main.py - Modified version of main.py for PyScript
import random
import time
from pyscript import document, display

# Mock pygame for web compatibility
class MockPygame:
    class font:
        @staticmethod
        def init():
            pass
        
        class SysFont:
            def __init__(self, name, size):
                self.name = name
                self.size = size
            
            def render(self, text, antialias, color):
                return MockSurface(text)
    
    class display:
        @staticmethod
        def set_mode(size):
            return MockSurface("Display")
        
        @staticmethod
        def set_caption(title):
            display(f"🎮 {title}", target="game-output")
        
        @staticmethod
        def update():
            pass
    
    class time:
        class Clock:
            def tick(self, fps):
                pass
    
    QUIT = "QUIT"
    KEYDOWN = "KEYDOWN"
    K_a = "a"
    K_d = "d"
    K_w = "w"
    K_s = "s"
    K_SPACE = "space"

class MockSurface:
    def __init__(self, content=""):
        self.content = content
        self.width = 100
        self.height = 100
    
    def get_width(self):
        return self.width
    
    def get_height(self):
        return self.height
    
    def blit(self, surface, pos):
        pass

# Replace pygame with mock
pygame = MockPygame()

# Your game classes with modifications for web
class Player:
    def __init__(self, x, y, health=100):
        self.x = x
        self.y = y
        self.health = health
        self.max_health = health
        self.lasers = []
        self.speed = 7
        
    def move(self, direction):
        if direction == "left" and self.x > 0:
            self.x -= self.speed
        elif direction == "right" and self.x < 700:
            self.x += self.speed
        elif direction == "up" and self.y > 0:
            self.y -= self.speed
        elif direction == "down" and self.y < 700:
            self.y += self.speed
            
    def shoot(self):
        laser = {"x": self.x + 25, "y": self.y, "speed": -10}
        self.lasers.append(laser)
        return laser
    
    def take_damage(self, damage=10):
        self.health -= damage
        return self.health <= 0

class Enemy:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.health = 100
        self.speed = random.randint(1, 3)
        self.color = random.choice(['red', 'green', 'blue'])
        
    def move(self):
        self.y += self.speed
        
    def off_screen(self):
        return self.y > 750

# Game state
game_state = {
    "running": False,
    "player": None,
    "enemies": [],
    "score": 0,
    "level": 1,
    "lives": 5
}

def log_game_message(message):
    """Display game messages"""
    display(message, target="game-output")

def initialize_game():
    """Initialize the game"""
    game_state["player"] = Player(300, 630)
    game_state["enemies"] = []
    game_state["score"] = 0
    game_state["level"] = 1
    game_state["lives"] = 5
    game_state["running"] = True
    
    log_game_message("🚀 SPACE SHOOTER GAME STARTED 🚀")
    log_game_message("=" * 40)
    log_game_message(f"Player Health: {game_state['player'].health}")
    log_game_message(f"Lives: {game_state['lives']}")
    log_game_message(f"Level: {game_state['level']}")
    
    spawn_enemies()

def spawn_enemies():
    """Spawn a new wave of enemies"""
    wave_size = 3 + game_state["level"]
    game_state["enemies"] = []
    
    for i in range(wave_size):
        x = random.randint(50, 650)
        y = random.randint(-200, -50)
        enemy = Enemy(x, y)
        game_state["enemies"].append(enemy)
    
    log_game_message(f"👾 Level {game_state['level']}: {wave_size} enemies spawned!")

def simulate_battle():
    """Simulate a battle round"""
    if not game_state["running"]:
        return
    
    player = game_state["player"]
    enemies = game_state["enemies"]
    
    # Simulate player shooting
    if enemies and random.random() > 0.3:  # 70% hit chance
        enemy = random.choice(enemies)
        enemies.remove(enemy)
        game_state["score"] += 10
        log_game_message(f"💥 Enemy destroyed! Score: {game_state['score']}")
    
    # Simulate enemy attack
    if enemies and random.random() > 0.6:  # 40% enemy hit chance
        damage = random.randint(5, 15)
        player.health -= damage
        log_game_message(f"💔 Player hit! Health: {player.health}")
    
    # Check wave completion
    if not enemies:
        game_state["level"] += 1
        log_game_message(f"🎉 Level {game_state['level']-1} complete!")
        spawn_enemies()
    
    # Check game over
    if player.health <= 0:
        game_state["running"] = False
        log_game_message("💀 GAME OVER!")
        log_game_message(f"Final Score: {game_state['score']}")
        log_game_message(f"Levels Completed: {game_state['level']-1}")

def player_action(action):
    """Handle player actions"""
    if not game_state["running"]:
        log_game_message("⚠️ Game not running! Start the game first.")
        return
    
    player = game_state["player"]
    
    if action == "shoot":
        player.shoot()
        log_game_message(f"🔫 Player shoots!")
        simulate_battle()
    elif action in ["left", "right", "up", "down"]:
        old_pos = (player.x, player.y)
        player.move(action)
        log_game_message(f"🏃 Moved {action}: {old_pos} → ({player.x}, {player.y})")
    
    # Display status
    log_game_message(f"Status: Health={player.health} | Lives={game_state['lives']} | Score={game_state['score']} | Enemies={len(game_state['enemies'])}")

# Main game function
def main():
    """Main game function - equivalent to main() in original"""
    log_game_message("Initializing Space Shooter Game...")
    initialize_game()

def main_menu():
    """Main menu function"""
    log_game_message("🎮 Welcome to Space Shooter!")
    log_game_message("Click the control buttons to play!")
    main()

# Auto-start the game when loaded
if __name__ == "__main__":
    main_menu()
