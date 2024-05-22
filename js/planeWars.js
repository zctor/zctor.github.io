// 填充代码
let code_json = {
    "main-1": `
import sys
import pygame
import config


class ShipWars:
    def __init__(self):
        pygame.init()

        self.screen = pygame.display.set_mode(config.SCREEN_SIZE)
        self.clock = pygame.time.Clock()
        pygame.display.set_caption("Ship Wars")

        self.bg_img = pygame.image.load("images/background.png")
        self.bg_pos = [0, -config.SCREEN_SIZE[1]]
        self.delay = 0

    def event_check(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

    def update(self):
        self.delay = (self.delay + 1) % 100
        bg_speed = 3
        for i in range(len(self.bg_pos)):
            self.bg_pos[i] += bg_speed
            if self.bg_pos[i] > config.SCREEN_SIZE[1]:
                self.bg_pos[i] = min(self.bg_pos)-config.SCREEN_SIZE[1] + (bg_speed if not i else 0)

    def draw(self):
        self.screen.fill(config.WHITE)
        for y in self.bg_pos:
            self.screen.blit(self.bg_img, [0, y])

        pygame.display.flip()
        self.clock.tick(config.FPS)

    def run(self):
        while True:
            self.event_check()
            self.update()
            self.draw()


if __name__ == '__main__':
    ShipWars().run()
`,
    "config-1": `
SCREEN_SIZE = (480, 700)
FPS = 60
WHITE = (255, 255, 255)
`,
    "config-2": `
SHIP_LIFE = 3
SHIP_SPEED = 8
`,
    "ship-1": `
import pygame
import config


class Ship(pygame.sprite.Sprite):
    def __init__(self, screen):
        pygame.sprite.Sprite.__init__(self)
        self.normal_images = [
            pygame.image.load("images/plane/me1.png").convert_alpha(),
            pygame.image.load("images/plane/me2.png").convert_alpha()
        ]
        self.destroy_images = [
            pygame.image.load("images/plane/me_destroy_1.png").convert_alpha(),
            pygame.image.load("images/plane/me_destroy_2.png").convert_alpha(),
            pygame.image.load("images/plane/me_destroy_3.png").convert_alpha(),
            pygame.image.load("images/plane/me_destroy_4.png").convert_alpha()
        ]
        self.screen = screen
        self.state = True
        self.index_images = 0
        self.life = config.SHIP_LIFE
        self.speed = config.SHIP_SPEED
        self.rect = self.normal_images[0].get_rect()
        self.mask = pygame.mask.from_surface(self.normal_images[0])

        self.rect.left, self.rect.top = (
            (self.screen.get_width()-self.rect.width) // 2,
            self.screen.get_height() - self.rect.height
        )

    def move(self, direction):
        if direction == "up":
            self.rect.y -= self.speed
            if self.rect.top < 0:
                self.rect.top = 0
        elif direction == "down":
            self.rect.y += self.speed
            if self.rect.bottom > self.screen.get_height():
                self.rect.bottom = self.screen.get_height()
        elif direction == "left":
            self.rect.x -= self.speed
            if self.rect.left < 0:
                self.rect.left = 0
        elif direction == "right":
            self.rect.x += self.speed
            if self.rect.right > self.screen.get_width():
                self.rect.right = self.screen.get_width()

    def update(self, delay):
        if not delay % 5:
            if self.state:
                self.index_images = (self.index_images + 1) % len(self.normal_images)
            else:
                self.index_images = (self.index_images + 1) % len(self.destroy_images)

    def draw(self):
        if self.state:
            self.screen.blit(self.normal_images[self.index_images], self.rect)
        else:
            self.screen.blit(self.destroy_images[self.index_images], self.rect)
`,
    "main-2": `
import sys
import ship
...  

class ShipWars:
    def __init__(self):
        ...
        self.delay = 0

        self.ship = None
        self.init_sprite()
    
    def init_sprite(self):
        self.ship = ship.Ship(self.screen)

    def event_check(self):
        ...
        keys = pygame.key.get_pressed()
        if keys[pygame.K_w]:
            self.ship.move("up")
        if keys[pygame.K_s]:
            self.ship.move("down")
        if keys[pygame.K_a]:
            self.ship.move("left")
        if keys[pygame.K_d]:
            self.ship.move("right")

    def update(self):
        ...
        self.ship.update(self.delay)

    def draw(self):
        ...
        self.ship.draw()

        pygame.display.flip()
        self.clock.tick(config.FPS)
    
    ...
`,
    "config-3": `
BULLET_SPEED = 12
BULLET_NUM = 4
`,
    "bullet-1": `
import pygame
import config

class Bullet(pygame.sprite.Sprite):
    def __init__(self, screen):
        pygame.sprite.Sprite.__init__(self)

        self.screen = screen
        self.image = pygame.image.load("images/bullet/bullet1.png").convert_alpha()
        self.rect = self.image.get_rect()

        self.state = False
        self.speed = config.BULLET_SPEED

    def update(self):
        if self.state:
            self.rect.y -= self.speed
            if self.rect.bottom <= 0:
                self.state = False

    def reset(self, pos):
        self.state = True
        self.rect.midtop = pos

    def draw(self):
        if self.state:
            self.screen.blit(self.image, self.rect)
`,
    "main-3": `
...
import bullet


class ShipWars:
    def __init__(self):
        ...
        self.ship = None
        self.bullet_list = []
        self.init_sprite()
    
    def init_sprite(self):
        self.ship = ship.Ship(self.screen)

        for _ in range(config.BULLET_NUM):
            self.bullet_list.append(bullet.Bullet(self.screen))
    
    ...
    def update(self):
        ...
        self.ship.update(self.delay)

        bullet_reset = True
        for b in self.bullet_list:
            if not self.delay % 15 and not b.state and bullet_reset:
                b.reset(self.ship.rect.midtop)
                bullet_reset = False
            b.update()
    
    def draw(self):
        ...
        for b in self.bullet_list:
            b.draw()
        
        self.ship.draw()
        ...
    ...
`,
    "config-4": `
ENEMY_SPEED = 8
ENEMY_NUM = 10
`,
    "enemy-1": `
import pygame
import config
from random import randint


class Enemy(pygame.sprite.Sprite):
    def __init__(self, screen):
        pygame.sprite.Sprite.__init__(self)

        self.screen = screen
        self.normal_image = pygame.image.load("images/enemy/enemy1.png").convert_alpha()
        self.destroy_images = [
            pygame.image.load("images/enemy/enemy1_down1.png").convert_alpha(),
            pygame.image.load("images/enemy/enemy1_down2.png").convert_alpha(),
            pygame.image.load("images/enemy/enemy1_down3.png").convert_alpha(),
            pygame.image.load("images/enemy/enemy1_down4.png").convert_alpha()
        ]

        self.rect = self.normal_image.get_rect()
        self.mask = pygame.mask.from_surface(self.normal_image)
        self.image_index = 0
        self.state = False
        self.speed = config.ENEMY_SPEED
        self.reset()

    def update(self, delay):
        if self.state:
            self.rect.y += self.speed
            if self.rect.top >= self.screen.get_height():
                self.state = False
        else:
            if not delay % 5:
                self.image_index = (self.image_index + 1) % len(self.destroy_images)
                if self.image_index == 0:
                    self.reset()

    def reset(self):
        self.rect.left, self.rect.top = (
            randint(0, config.SCREEN_SIZE[0]-self.rect.width),
            randint(-config.SCREEN_SIZE[1], -self.rect.height)
        )
        self.state = True

    def draw(self):
        if self.state:
            self.screen.blit(self.normal_image, self.rect)
        else:
            self.screen.blit(self.destroy_images[self.image_index], self.rect)
`,
    "main-4": `
...
import enemy
...
    def __init__(self):
        ...
        self.bullet_list = []
        self.enemy_list = []
        ...
    
    def init_sprite(self):
        ...
        for _ in range(config.ENEMY_NUM):
            self.enemy_list.append(enemy.Enemy(self.screen))
    
    ...
    def update(self):
        ...
        self.ship.update(self.delay)

        for e in self.enemy_list:
            e.update(self.delay)
        ...
    
    def draw(self):
        self.screen.fill(config.WHITE)
        for y in self.bg_pos:
            self.screen.blit(self.bg_img, [0, y])

        for e in self.enemy_list:
            e.draw()
        ...
`,
    "main-5": `
def update(self.delay):
    ...
    for b in self.bullet_list:
        if not self.delay % 15 and not b.state and bullet_reset:
            b.reset(self.ship.rect.midtop)
            bullet_reset = False
        b.update()
        for e in self.enemy_list:
            if pygame.sprite.collide_mask(b, e) and b.state and e.state:
                b.state = False
                e.state = False
`,
    "main-6": `
def update():
    ...
    for e in self.enemy_list:
        e.update(self.delay)
        if pygame.sprite.collide_mask(self.ship, e) and self.ship.state:
            self.ship.state = False
            e.state = False
`,
    "main-7": `
def __init__(self):
    ...
    self.score = 0
    self.score_img = None
    self.score_font = pygame.font.FontType("font/font.ttf", 36)
    
    self.init_sprite()
`,
    "main-8": `
def update(self):
    ...
    for b in self.bullet_list:
        ...
        for e in self.enemy_list:
            if pygame.sprite.collide_mask(b, e) and b.state and e.state:
                ...
                self.score += 100
    self.score_img = self.score_font.render(
        "Score: {:,d}".format(self.score),
        True,
        (255, 255, 255)
)

def draw(self):
    ...
    self.ship.draw()

    self.screen.blit(self.score_img, (10, 5))
    ...
`,
    "main-9": `
...
def __init__(self):
    ...
    self.ui_dic = {}
    self.init_sprite()

def init_sprite(self):
    ship_life_img = pygame.image.load("images/ui/life.png").convert_alpha()
    ship_life_rect = ship_life_img.get_rect()
    self.ui_dic["ship_life"] = {"image": ship_life_img, "rect": ship_life_rect}
    ...

...
def draw(self):
    ...
    for i in range(self.ship.life):
        self.screen.blit(
            self.ui_dic["ship_life"]["image"],
            (
                config.SCREEN_SIZE[0]-(i+1)*(self.ui_dic["ship_life"]["rect"].width+8),
                config.SCREEN_SIZE[1]-self.ui_dic["ship_life"]["rect"].height
            )
        )
    ...
`,
    "main-10": `
...
def __init__(self):
    ...
    self.game_over = False
    self.init_sprite()

...
def update(self):
    ...
    if self.game_over:
        return

    self.ship.update(self.delay)
    if self.ship.life == 0 and self.ship.state:
        self.game_over = True

    for e in self.enemy_list:
        e.update(self.delay)
        if pygame.sprite.collide_mask(self.ship, e) and self.ship.state:
            e.state = False
            self.ship.state = False
            self.ship.life -= 1
    ...

...
def draw(self):
    self.screen.fill(config.WHITE)
    for y in self.bg_pos:
        self.screen.blit(self.bg_img, [0, y])

    if self.game_over:
        pass
    else:
        ...
    self.screen.blit(self.score_img, (10, 5))

    pygame.display.flip()
    self.clock.tick(config.FPS)
`,
    "main-11": `
def init_sprite(self):
    restart_img = pygame.image.load("images/menu/again.png").convert_alpha()
    restart_rect = restart_img.get_rect()
    restart_rect.center = config.SCREEN_SIZE[0] / 2, config.SCREEN_SIZE[1] / 2
    self.ui_dic["restart"] = {"image": restart_img, "rect": restart_rect}
    ...

def event_check(self):
    ...
    mouse_pressed = pygame.mouse.get_pressed()
    mouse_pos = pygame.mouse.get_pos()
    if mouse_pressed[0] and self.ui_dic["restart"]["rect"].collidepoint(mouse_pos):
        self.game_over = False
        self.ship.life = config.SHIP_LIFE
        self.ship.reset()

        self.score = 0
        for e in self.enemy_list:
            e.reset()

...
def draw(self):
    ...
    if self.game_over:
        self.screen.blit(self.ui_dic["restart"]["image"], self.ui_dic["restart"]["rect"])
    ...
`,
    "ship-2": `
...
def __init__(self, screen):
    ...
    self.invincible = False

...
def update(self, delay):
    if not delay % 5:
        if self.state or self.invincible:
            self.index_images = (self.index_images + 1) % len(self.normal_images)
        else:
            self.index_images = (self.index_images + 1) % len(self.destroy_images)
            if self.index_images == 0:
                if self.invincible:
                    return
                self.reset()

def draw(self, delay):
    if self.state:
        self.screen.blit(self.normal_images[self.index_images], self.rect)
    elif self.invincible:
        if not delay % 5:
            self.screen.blit(self.normal_images[self.index_images], self.rect)
    else:
        self.screen.blit(self.destroy_images[self.index_images], self.rect)

def reset(self):
    ...
    self.invincible = True
`,
    "main-12": `
...
def __init__(self):
    ...
    self.invincible = pygame.USEREVENT

...
def event_check(self):
    for event in pygame.event.get():
        ...
        elif event.type == self.invincible:
            self.ship.state = True
            self.ship.invincible = False
            pygame.time.set_timer(self.invincible, 0)

def update(self):
    ...
    self.ship.update(self.delay)
    if self.ship.life == 0 and self.ship.state:
        self.game_over = True
    if self.ship.invincible and self.ship.state:
        self.ship.state = False
        pygame.time.set_timer(self.invincible, 1*1000)
    ...
`,
    "main-all": `
import sys
import enemy
import ship
import pygame
import config
import bullet


class ShipWars:
    def __init__(self):
        pygame.init()

        self.screen = pygame.display.set_mode(config.SCREEN_SIZE)
        self.clock = pygame.time.Clock()
        pygame.display.set_caption("Ship Wars")

        self.bg_img = pygame.image.load("images/background.png")
        self.bg_pos = [0, -config.SCREEN_SIZE[1]]
        self.delay = 0

        self.ship = None
        self.bullet_list = []
        self.enemy_list = []

        self.score = 0
        self.score_img = None
        self.score_font = pygame.font.FontType("font/font.ttf", 36)

        self.ui_dic = {}
        self.game_over = False
        self.invincible = pygame.USEREVENT

        self.init_sprite()

    def init_sprite(self):
        ship_life_img = pygame.image.load("images/ui/life.png").convert_alpha()
        ship_life_rect = ship_life_img.get_rect()
        self.ui_dic["ship_life"] = {"image": ship_life_img, "rect": ship_life_rect}
        restart_img = pygame.image.load("images/menu/again.png").convert_alpha()
        restart_rect = restart_img.get_rect()
        restart_rect.center = config.SCREEN_SIZE[0] / 2, config.SCREEN_SIZE[1] / 2
        self.ui_dic["restart"] = {"image": restart_img, "rect": restart_rect}

        self.ship = ship.Ship(self.screen)

        for _ in range(config.BULLET_NUM):
            self.bullet_list.append(bullet.Bullet(self.screen))

        for _ in range(config.ENEMY_NUM):
            self.enemy_list.append(enemy.Enemy(self.screen))

    def event_check(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == self.invincible:
                self.ship.state = True
                self.ship.invincible = False
                pygame.time.set_timer(self.invincible, 0)

        keys = pygame.key.get_pressed()
        if keys[pygame.K_w]:
            self.ship.move("up")
        if keys[pygame.K_s]:
            self.ship.move("down")
        if keys[pygame.K_a]:
            self.ship.move("left")
        if keys[pygame.K_d]:
            self.ship.move("right")

        mouse_pressed = pygame.mouse.get_pressed()
        mouse_pos = pygame.mouse.get_pos()
        if mouse_pressed[0] and self.ui_dic["restart"]["rect"].collidepoint(mouse_pos):
            self.game_over = False
            self.ship.life = config.SHIP_LIFE
            self.ship.reset()
            self.ship.invincible = False

            self.score = 0
            for e in self.enemy_list:
                e.reset()

    def update(self):
        self.delay = (self.delay + 1) % 100
        bg_speed = 3
        for i in range(len(self.bg_pos)):
            self.bg_pos[i] += bg_speed
            if self.bg_pos[i] > config.SCREEN_SIZE[1]:
                self.bg_pos[i] = (min(self.bg_pos)-config.SCREEN_SIZE[1] +
                                  (bg_speed if not i else 0))

        if self.game_over:
            return

        self.ship.update(self.delay)
        if self.ship.life == 0 and self.ship.state:
            self.game_over = True
        if self.ship.invincible and self.ship.state:
            self.ship.state = False
            pygame.time.set_timer(self.invincible, 1*1000)

        for e in self.enemy_list:
            e.update(self.delay)
            if pygame.sprite.collide_mask(self.ship, e) and self.ship.state:
                e.state = False
                self.ship.state = False
                self.ship.life -= 1

        bullet_reset = True
        for b in self.bullet_list:
            if not self.delay % 15 and not b.state and bullet_reset:
                if self.ship.state:
                    b.reset(self.ship.rect.midtop)
                bullet_reset = False
            b.update()
            for e in self.enemy_list:
                if pygame.sprite.collide_mask(b, e) and b.state and e.state:
                    b.state = False
                    e.state = False
                    self.score += 100

        self.score_img = self.score_font.render(
            "Score: {:,d}".format(self.score),
            True,
            (255, 255, 255)
        )

    def draw(self):
        self.screen.fill(config.WHITE)
        for y in self.bg_pos:
            self.screen.blit(self.bg_img, [0, y])

        if self.game_over:
            self.screen.blit(self.ui_dic["restart"]["image"], self.ui_dic["restart"]["rect"])
        else:
            for e in self.enemy_list:
                e.draw()

            for b in self.bullet_list:
                b.draw()

            self.ship.draw(self.delay)

            for i in range(self.ship.life):
                self.screen.blit(
                    self.ui_dic["ship_life"]["image"],
                    (
                        config.SCREEN_SIZE[0]-(i+1)*(self.ui_dic["ship_life"]["rect"].width+8),
                        config.SCREEN_SIZE[1]-self.ui_dic["ship_life"]["rect"].height
                    )
                )

        self.screen.blit(self.score_img, (10, 5))

        pygame.display.flip()
        self.clock.tick(config.FPS)

    def run(self):
        while True:
            self.event_check()
            self.update()
            self.draw()


if __name__ == '__main__':
    ShipWars().run()
`,
    "config-all": `
SCREEN_SIZE = (480, 700)
FPS = 60
WHITE = (255, 255, 255)

SHIP_LIFE = 3
SHIP_SPEED = 8

BULLET_SPEED = 12
BULLET_NUM = 4

ENEMY_SPEED = 8
ENEMY_NUM = 10
`,
    "ship-all": `
import pygame
import config


class Ship(pygame.sprite.Sprite):
    def __init__(self, screen):
        pygame.sprite.Sprite.__init__(self)
        self.normal_images = [
            pygame.image.load("images/plane/me1.png").convert_alpha(),
            pygame.image.load("images/plane/me2.png").convert_alpha()
        ]
        self.destroy_images = [
            pygame.image.load("images/plane/me_destroy_1.png").convert_alpha(),
            pygame.image.load("images/plane/me_destroy_2.png").convert_alpha(),
            pygame.image.load("images/plane/me_destroy_3.png").convert_alpha(),
            pygame.image.load("images/plane/me_destroy_4.png").convert_alpha()
        ]
        self.screen = screen
        self.state = True
        self.index_images = 0
        self.life = config.SHIP_LIFE
        self.speed = config.SHIP_SPEED
        self.invincible = False
        self.rect = self.normal_images[0].get_rect()
        self.mask = pygame.mask.from_surface(self.normal_images[0])

        self.rect.left, self.rect.top = (
            (self.screen.get_width()-self.rect.width) // 2,
            self.screen.get_height() - self.rect.height - 65
        )

    def move(self, direction):
        if direction == "up":
            self.rect.y -= self.speed
            if self.rect.top < 0:
                self.rect.top = 0
        elif direction == "down":
            self.rect.y += self.speed
            if self.rect.bottom > self.screen.get_height() - 65:
                self.rect.bottom = self.screen.get_height() - 65
        elif direction == "left":
            self.rect.x -= self.speed
            if self.rect.left < 0:
                self.rect.left = 0
        elif direction == "right":
            self.rect.x += self.speed
            if self.rect.right > self.screen.get_width():
                self.rect.right = self.screen.get_width()

    def update(self, delay):
        if not delay % 5:
            if self.state or self.invincible:
                self.index_images = (self.index_images + 1) % len(self.normal_images)
            else:
                self.index_images = (self.index_images + 1) % len(self.destroy_images)
                if self.index_images == 0:
                    if self.invincible:
                        return
                    self.reset()

    def draw(self, delay):
        if self.state:
            self.screen.blit(self.normal_images[self.index_images], self.rect)
        elif self.invincible:
            if not delay % 5:
                self.screen.blit(self.normal_images[self.index_images], self.rect)
        else:
            self.screen.blit(self.destroy_images[self.index_images], self.rect)

    def reset(self):
        self.state = True
        self.invincible = True
        self.rect.left, self.rect.top = (
            (self.screen.get_width() - self.rect.width) // 2,
            self.screen.get_height() - self.rect.height - 65
        )
`,
    "bullet-all": `
import pygame
import config

class Bullet(pygame.sprite.Sprite):
    def __init__(self, screen):
        pygame.sprite.Sprite.__init__(self)

        self.screen = screen
        self.image = pygame.image.load("images/bullet/bullet1.png").convert_alpha()
        self.rect = self.image.get_rect()
        self.mask = pygame.mask.from_surface(self.image)

        self.state = False
        self.speed = config.BULLET_SPEED

    def update(self):
        if self.state:
            self.rect.y -= self.speed
            if self.rect.bottom <= 0:
                self.state = False

    def reset(self, pos):
        self.state = True
        self.rect.midtop = pos

    def draw(self):
        if self.state:
            self.screen.blit(self.image, self.rect)
`,
    "enemy-all": `
import pygame
import config
from random import randint


class Enemy(pygame.sprite.Sprite):
    def __init__(self, screen):
        pygame.sprite.Sprite.__init__(self)

        self.screen = screen
        self.normal_image = pygame.image.load("images/enemy/enemy1.png").convert_alpha()
        self.destroy_images = [
            pygame.image.load("images/enemy/enemy1_down1.png").convert_alpha(),
            pygame.image.load("images/enemy/enemy1_down2.png").convert_alpha(),
            pygame.image.load("images/enemy/enemy1_down3.png").convert_alpha(),
            pygame.image.load("images/enemy/enemy1_down4.png").convert_alpha()
        ]

        self.rect = self.normal_image.get_rect()
        self.mask = pygame.mask.from_surface(self.normal_image)
        self.image_index = 0
        self.state = False
        self.speed = config.ENEMY_SPEED
        self.reset()

    def update(self, delay):
        if self.state:
            self.rect.y += self.speed
            if self.rect.top >= self.screen.get_height():
                self.state = False
        else:
            if not delay % 5:
                self.image_index = (self.image_index + 1) % len(self.destroy_images)
                if self.image_index == 0:
                    self.reset()

    def reset(self):
        self.rect.left, self.rect.top = (
            randint(0, config.SCREEN_SIZE[0]-self.rect.width),
            randint(-config.SCREEN_SIZE[1], -self.rect.height)
        )
        self.state = True

    def draw(self):
        if self.state:
            self.screen.blit(self.normal_image, self.rect)
        else:
            self.screen.blit(self.destroy_images[self.image_index], self.rect)
`,
};
let code_list = document.querySelectorAll("pre code");
for (let i = 0; i < code_list.length; i++) {
    let key = code_list[i].getAttribute("class");
    let line = code_json[key].split("\n").slice(1, -1);

    for (let j = 0; j < line.length; j++) {
        let tag_span_n = document.createElement("span");
        tag_span_n.setAttribute("class", "num");
        tag_span_n.style.userSelect = "none";
        tag_span_n.innerHTML = j + 1;

        let tag_span_code = document.createElement("span");
        tag_span_code.setAttribute("class", "code");
        if (j == line.length - 1) {
            tag_span_code.style.marginBottom = "20px";
        }
        tag_span_code.innerHTML = line[j];
        code_list[i].appendChild(tag_span_n);
        code_list[i].appendChild(tag_span_code);
    }
}

// 复制代码
function copyText(own) {
    let tt = document.createElement("textarea");
    document.body.appendChild(tt);

    tt.value = code_json[own.parentNode.getAttribute("class")].split("\n").slice(1, -1).join("\n");
    tt.select();
    document.execCommand("copy");
    tt.remove();
}

// 鼠标进入元素时显示菜单子选项
let option = document.querySelectorAll("dt");
for (let o=0; o<option.length; o++) {
    option[o].setAttribute("onmouseenter", "setShow(this)");
}
function setShow(own) {
    for (let o=0; o<option.length; o++) {
        if (option[o].classList.contains("show")) {
            option[o].classList.remove("show");
        }
    }
    own.classList.add("show");
}
// 鼠标离开元素时关闭菜单子选项
function setNotShow() {
    for (let o=0; o<option.length; o++) {
        if (option[o].classList.contains("show")) {
            option[o].classList.remove("show");
        }
    }
}