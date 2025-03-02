from django.db import models


class User(models.Model):
    id = models.IntegerField(primary_key=True)
    login = models.CharField(max_length=30)
    first_name = models.CharField(max_length=50, default='Unknown')
    last_name = models.CharField(max_length=50, default="Unknown")
    image = models.CharField(blank=True, max_length=200)
    twoFA = models.BooleanField(default=False)
    twoFAKey = models.TextField(default='')
    is_twofa_validated = models.BooleanField(default=True)
    email = models.EmailField()

    def is_2fa_ebnabled(self):
        return self.twoFA

    def enable_2FA(self):
        self.twoFA = True

    class Meta:
        db_table = 'User'


class Blacklist(models.Model):
    access = models.CharField(max_length=512, blank=True)
    refresh = models.CharField(max_length=512, blank=True)

    class Meta:
        db_table = 'Blacklist'
# these models will be created in the Game-server
# class Game(models.Model):
#     gameId = models.IntegerField(primary_key=True)
#     title = models.CharField(max_length=30)
#     userId = models.ForeignKey(User, on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)
#
#     class Meta:
#         db_table = 'Game'
#
#
# class History(models.Model):
#     gameId = models.ForeignKey(
#         Game, on_delete=models.CASCADE)
#     player1Id = models.IntegerField()
#     player2Id = models.IntegerField()
#     player1Login = models.CharField(max_length=20)
#     player2Login = models.CharField(max_length=20)
#     winId = models.IntegerField()
#     loseId = models.IntegerField()
#     totalGames = models.BigIntegerField(default=0)
#     score = models.IntegerField(default=0)
#
#     class Meta:
#         db_table = 'History'


# class User(models.Model):
#     id = models.IntegerField(primary_key=True)
#     login = models.CharField(max_length=30)
#     first_name = models.CharField(max_length=30, default='AI')
#     last_name = models.CharField(max_length=30, default="rs")
#     image = models.CharField(blank=True, max_length=200)
#     twoFA = models.BooleanField(default=False)
#     twoFAKey = models.TextField(default='')
#     is_twofa_validated = models.BooleanField(default=True)
#     email = models.EmailField()
#
#     def is_2fa_ebnabled(self):
#         return self.twoFA
#
#     def enable_2FA(self):
#         self.twoFA = True

# class Game(models.Model):


# Create your models here.
